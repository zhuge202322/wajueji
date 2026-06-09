/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lingjuimg.com"
      },
      {
        protocol: "https",
        hostname: "www.shanghaiyymachinery.com"
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb"
    }
  }
};

export default nextConfig;
