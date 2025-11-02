import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
                protocol: "https",
            },
            {
                hostname: "*.googleusercontent.com",
                protocol: "https",
            },
            {
                hostname: "avatar.vercel.sh",
                protocol: "https",
            },
            {
                hostname: "*.ufs.sh",
                protocol: "https",
            },
        ]
    }
};

export default nextConfig;

// 9phei2f9iq.ufs.sh