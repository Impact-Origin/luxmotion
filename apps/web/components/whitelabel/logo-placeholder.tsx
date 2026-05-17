import Link from "next/link"

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

export function LogoPlaceholder({
  href = "/whitelabel",
  className,
}: {
  href?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center border border-dashed border-[#C9A96E]/70 px-4 h-[46px] min-w-[140px] shrink-0 ${className ?? ""}`}
    >
      <span
        className="text-[11px] font-medium tracking-[2.5px] uppercase text-[#C9A96E]"
        style={SANS_FONT}
      >
        LOCOMARCA
      </span>
    </Link>
  )
}
