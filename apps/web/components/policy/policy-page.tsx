import type { ReactNode } from "react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function PolicyH3({ children }: { children: ReactNode }) {
  return (
    <h3
      className="w-full pt-3 text-[#1C1B18] text-[14px] font-bold leading-[1.85]"
      style={sans}
    >
      {children}
    </h3>
  )
}

export function PolicyHighlight({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full bg-[rgba(154,117,53,0.07)] border-l-[2.4px] border-[#9A7535] pl-[22.4px] pr-5 pt-[19.11px] pb-5 text-[14px] text-[#1C1B18] leading-[1.5]"
      style={sans}
    >
      {children}
    </div>
  )
}

export function PolicyBulletList({ children }: { children: ReactNode }) {
  return (
    <ul className="w-full flex flex-col gap-1 pt-[8.9px]">{children}</ul>
  )
}

export function PolicyBullet({ children }: { children: ReactNode }) {
  return (
    <li
      className="relative pl-4 py-[3.2px] text-[14px] text-[rgba(28,27,24,0.62)] leading-[1.5]"
      style={sans}
    >
      <span
        aria-hidden
        className="absolute left-0 top-[12px] size-[6px] rounded-[3px] bg-[#9A7535]"
      />
      {children}
    </li>
  )
}

export interface PolicySection {
  title: string
  body: ReactNode
}

export interface PolicyContactItem {
  label: string
  value: string
  href?: string
}

interface PolicyPageProps {
  title: string
  sections: PolicySection[]
  contactIntro?: string
  contactItems?: PolicyContactItem[]
  lastUpdated: string
}

export function PolicyPage({
  title,
  sections,
  contactIntro,
  contactItems,
  lastUpdated,
}: PolicyPageProps) {
  return (
    <section className="bg-[#F7F4EF] flex items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-[720px] flex flex-col items-end gap-[10.9px] pt-12 pb-20">
        <h1
          className="w-full pb-[18.4px] border-b-[2.4px] border-[#9A7535] text-[#1C1B18] text-[40px] md:text-[48px] font-semibold leading-none"
          style={serif}
        >
          {title}
        </h1>

        {sections.map((section, i) => (
          <div key={i} className="w-full flex flex-col gap-[10.9px]">
            <h2
              className="w-full pt-6 text-[#1C1B18] text-[24px] font-semibold leading-[1.4733]"
              style={serif}
            >
              {section.title}
            </h2>
            <div
              className="w-full text-[14px] text-[rgba(28,27,24,0.62)] leading-[1.5] [&_p]:leading-[1.5] [&_p+p]:mt-2"
              style={sans}
            >
              {section.body}
            </div>
          </div>
        ))}

        {(contactIntro || (contactItems && contactItems.length > 0)) && (
          <div className="w-full flex flex-col gap-[10.9px]">
            {contactIntro && (
              <p
                className="w-full text-[14px] text-[rgba(28,27,24,0.62)] leading-[1.5]"
                style={sans}
              >
                {contactIntro}
              </p>
            )}
            {contactItems && contactItems.length > 0 && (
              <ul className="w-full flex flex-col gap-1 pt-[5.1px] pb-[29px]">
                {contactItems.map((item, i) => (
                  <li
                    key={i}
                    className="relative pl-4 py-[3.2px] text-[14px] text-[rgba(28,27,24,0.62)] leading-[1.5]"
                    style={sans}
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[12px] size-[6px] rounded-[3px] bg-[#9A7535]"
                    />
                    {item.label}:{" "}
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[rgba(28,27,24,0.62)] hover:text-[#9A7535] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="w-full pt-[16.8px] border-t-[0.8px] border-[rgba(28,27,24,0.08)]">
          <p
            className="text-[12px] italic text-[rgba(28,27,24,0.38)] leading-[1.7]"
            style={sans}
          >
            {lastUpdated}
          </p>
        </div>
      </div>
    </section>
  )
}
