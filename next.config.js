/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    domains: [
      "res.cloudinary.com",      
      "avatars.githubusercontent.com",
      "placeimg.com",
      "lh3.googleusercontent.com"
    ],
  },
  reactStrictMode: true,
  swcMinify: false, // Required to fix: https://nextjs.org/docs/messages/failed-loading-swc
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true
  }
};
