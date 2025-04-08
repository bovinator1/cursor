/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.190',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://192.168.1.190:3000',
      'http://192.168.1.190:3001',
      'http://192.168.1.190:3002',
    ],
  },
}

module.exports = nextConfig 