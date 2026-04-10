export interface ExperienceExtra {
  id: string
  label: string
  price: number
  pricingType?: "per_person" | "flat"
}

export interface Experience {
  id: string
  title: string
  description: string
  image: string
  basePrice: number
  extras: ExperienceExtra[]
}

