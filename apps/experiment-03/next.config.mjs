/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/exp3-static",
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],    
  },  
}

export default nextConfig
