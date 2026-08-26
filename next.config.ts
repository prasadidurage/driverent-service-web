import type { NextConfig } from "next";

const API_GATEWAY_TARGET =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:7000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000",
        pathname: "/api/v1/customers/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_GATEWAY_TARGET}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
