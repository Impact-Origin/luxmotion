import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "**.convex.site",
      },
      // Custom Convex domain (e.g. convex.easytransferportugal.com)
      {
        protocol: "https",
        hostname: "convex.easytransferportugal.com",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
