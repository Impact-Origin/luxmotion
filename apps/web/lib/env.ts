export function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "")
}

export const NEXT_PUBLIC_BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL
export const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export function getGoogleMapsApiKey(): string {
  if (!NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
  }
  return NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}

