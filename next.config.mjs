/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TODO: Fix typed routes generation issue with Next.js 15
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
