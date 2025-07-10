/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the 'images' configuration here
  images: {
    // remotePatterns allows you to define which external domains are allowed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.football.api-sports.io',
      },
      // === THIS IS THE NEW PART FOR NEWS IMAGES ===
      // newsdata.io provides images from many different sources,
      // so we need to allow them.
      {
        protocol: 'https',
        hostname: 'www.sportsmole.co.uk', // The one from the error
      },
      {
        protocol: 'https',
        hostname: 'www.thesportstak.com', // A common one
      },
      {
        protocol: 'https',
        hostname: 'media.wired.com', // Another example
      },
      // You can add more as you see them in error messages, or use a wildcard.
      // A wildcard is less secure but more convenient:
      {
        protocol: 'https',
        hostname: '**.**.**', // Very broad, allows any domain
      },
      {
        protocol: 'https',
        hostname: '**.**', // Also very broad
      },
       {
        protocol: 'https',
        hostname: 'cdn.theathletic.com', 
      },
       {
        protocol: 'https',
        hostname: 'i2-prod.football.london', 
      }
    ],
  },
};

module.exports = nextConfig;