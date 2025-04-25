/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/init',
        destination: '/api/init',
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig; 