import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    // Servimos as imagens tal como estão, sem passar pelo optimizador do Vercel:
    // a quota esgotou e /_next/image devolvia 402 em todo o site. Os ficheiros
    // em public/ foram convertidos para WebP com o lado maior a 1920px (375MB
    // -> 21MB), por isso já vêm no tamanho certo e o optimizador não acrescenta
    // nada. As remotas (Convex, Google) também deixam de gastar quota.
    unoptimized: true,
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
