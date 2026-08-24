import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  // O apex e o www servem o mesmo site, e o Google trata-os como dois. O
  // redirect existe hoje ao nível do domínio no Vercel; aqui fica no código,
  // para sobreviver a uma reconfiguração do painel.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "easytransferportugal.com" }],
        destination: "https://www.easytransferportugal.com/:path*",
        permanent: true,
      },
    ];
  },
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
      // Imagens do feed do Instagram (o CDN da Meta serve por vários domínios)
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
