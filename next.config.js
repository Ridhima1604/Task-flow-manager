/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: 'build',
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  typescript: {
    // We'll handle type checking separately
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}
module.exports = nextConfig
