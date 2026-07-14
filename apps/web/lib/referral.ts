"use client"

import { useEffect, useState } from "react"

/**
 * Affiliate-link lead attribution.
 *
 * When a visitor lands on a valid, active partnership page (`/[referral]` or
 * `/[referral]/checkout`) the server sets a first-party `et_ref` cookie holding
 * the partnership slug (see the two server components in `app/[referral]`).
 * These helpers read that cookie on the client so lead forms / checkouts on the
 * main site can still attribute the submission to the referring partner.
 */

const COOKIE_NAME = "et_ref"

/**
 * Read the `et_ref` referral slug from `document.cookie`.
 * SSR-safe: returns `null` when `document` is unavailable.
 */
export function readReferralCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`),
  )
  if (!match) return null
  const value = match[1]
  return value == null ? null : decodeURIComponent(value)
}

/**
 * Hook returning the referral slug from the `et_ref` cookie.
 * Reads once on mount so the first render matches the server (`null`),
 * keeping it hydration-safe.
 */
export function useReferral(): string | null {
  const [referral, setReferral] = useState<string | null>(null)
  useEffect(() => {
    setReferral(readReferralCookie())
  }, [])
  return referral
}
