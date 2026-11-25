import type { NextConfig } from "next";

// Static export: `next build` writes a fully static site to ./out
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
