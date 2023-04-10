/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  checkJs: true,
  reactRemoveProperties: {properties: ["^data-custom$"]},
  removeConsole: true,
};

module.exports = nextConfig;
