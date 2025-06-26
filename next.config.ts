/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sportmonks.com', // The correct domain for Sportmonks images
        port: '',
        pathname: '/**', // Allow all images from this domain
      },
    ],
  },
};

module.exports = nextConfig;