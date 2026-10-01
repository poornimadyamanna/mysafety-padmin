/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "206.189.138.2",
        "206.189.138.2:3000",
        "206.189.138.2:4000",
        "mysafety24x7.in",
      ],
    },
  },
};

export default nextConfig;
