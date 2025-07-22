/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  eslint: {
      ignoreDuringBuilds: true,
  },
  typescript: {
      ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
