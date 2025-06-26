/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.api-sports.io', // The correct domain for API-Football logos
        port: '',
        pathname: '/**', // Allow all images from this domain
      },
    ],
  },
};

module.exports = nextConfig;