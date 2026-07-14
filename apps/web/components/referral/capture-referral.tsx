"use client"

import { useEffect } from "react"

const COOKIE_NAME = "et_ref"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 60 // 60 days

/**
 * Drops a first-party `et_ref` cookie (client-side) holding the partnership
 * slug, so lead forms and checkouts elsewhere on the site can attribute a
 * submission back to the partner whose landing page the visitor arrived
 * through. Read back via `readReferralCookie()` in `@/lib/referral`.
 *
 * Written on the client (not `next/headers` `cookies().set()`) because mutating
 * cookies during a Server Component render throws in Next.js. Rendered only
 * after the server component has confirmed a valid, active partnership.
 */
export function CaptureReferral({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      slug,
    )}; max-age=${MAX_AGE_SECONDS}; path=/; samesite=lax`
  }, [slug])
  return null
}
