import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    // Allowed next/image quality values (default 75 + the explicit quality={90}).
    // Required from Next.js 16; silences the build warning now.
    qualities: [75, 90],
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
      // Fotos de perfil dos autores das reviews do Google
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
