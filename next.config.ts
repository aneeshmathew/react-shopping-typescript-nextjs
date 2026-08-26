import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
    ],
  },
  // Turbopack's persistent build cache has been shipping stale output on
  // some Vercel deployments (same commit, old compiled chunks served).
  // Disabling it trades a bit of build speed for deploys that reliably
  // reflect the pushed source.
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
