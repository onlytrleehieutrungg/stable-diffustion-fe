import React, {useState} from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {Button, Box} from "@mui/material";
import {useForm} from "react-hook-form";

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [firstImage, setFirstImage] = useState(null);
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();

  const changeHandler = async event => {
    // setFirstImage(event.target.files[0]);
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setFirstImage(imageUrl);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(reader.result);
    };
    reader.readAsBinaryString(file);

    setIsFilePicked(true);
  };
  console.log(isFilePicked);
  const onSubmit = async data => {
    const formData = new FormData();
    formData.append("prompt", data.prompt);
    formData.append("image", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:3000/stable-diffusion-integration",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // const base64String = btoa(
      //   String.fromCharCode(...new Uint8Array(r))
      // );
      setImage(response.data.artifacts[0].base64);
      // console.log("res", response.data);
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("prompt")}
          label="Nhập Prompt"
          variant="standard"
          color="warning"
          sx={{color: "white", py: "4px", width: "20rem"}}
          focused
        />
        <br />
        <TextField
          type="file"
          {...register("image")}
          onChange={changeHandler}
        />
        <br />
        <Button type="submit" disabled={!isFilePicked}>
          submit
        </Button>
      </form>
      {isFilePicked == true && image == null ? (
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: {xs: 233, md: 167},
            maxWidth: {xs: 350, md: 250},
          }}
          alt="not found"
          src={firstImage}
        />
      ) : (
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: {xs: 233, md: 167},
            maxWidth: {xs: 350, md: 250},
          }}
          alt="not yet"
          src={`data:image/png;base64,${image}`}
        />
      )}
      {/* <Box
        component="img"
        sx={{
          height: 233,
          width: 350,
          maxHeight: {xs: 233, md: 167},
          maxWidth: {xs: 350, md: 250},
        }}
        alt="The house from the offer."
        src={`data:image/png;base64,${image}`}
      /> */}
    </div>
  );
}

export default UploadImage;
