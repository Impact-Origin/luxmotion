export interface MockEvent {
  _id: string
  slug: string
  title: string
  subtitle: string
  description: any
  originalLanguage: string
  location: string
  venue: string
  eventDate: number
  endDate?: number
  isFeatured: boolean
  isActive: boolean
  status: "draft" | "published" | "cancelled" | "completed"
  maxCapacity?: number
  privatePrice: number
  sharedPrice?: number
  currency: string
  bannerImageUrl: string
  galleryImageUrls: string[]
  included: string[]
  excluded: string[]
  tags: string[]
  meetingPoint: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  rating: number
  reviewCount: number
  publishedAt: number
  createdAt: number
  updatedAt: number
  availableLanguages: string[]
}

const futureDate = (daysFromNow: number) => Date.now() + 86400000 * daysFromNow

export const MOCK_EVENTS: MockEvent[] = [
  {
    _id: "event-1",
    slug: "lisbon-fado-night",
    title: "Traditional Fado Night in Alfama",
    subtitle: "Experience the soul of Portugal through its traditional music",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Join us for an unforgettable evening of Fado music in the heart of Alfama, Lisbon's oldest neighborhood. Experience the melancholic beauty of Portugal's traditional music genre, accompanied by local wine and tapas." }] },
      ]
    },
    originalLanguage: "en",
    location: "Lisbon",
    venue: "Casa do Fado",
    eventDate: futureDate(15),
    endDate: futureDate(15) + 3600000 * 4,
    isFeatured: true,
    isActive: true,
    status: "published",
    maxCapacity: 50,
    privatePrice: 65,
    sharedPrice: 15,
    currency: "EUR",
    bannerImageUrl: "/mockup-tours-details/Frame 1171275668.webp",
    galleryImageUrls: [],
    included: [
      "Fado show",
      "3-course dinner",
      "2 glasses of wine",
      "Reserved seating",
    ],
    excluded: [
      "Additional drinks",
      "Hotel transfer",
    ],
    tags: ["Music", "Cultural", "Dinner"],
    meetingPoint: {
      title: "Casa do Fado",
      address: "Rua São João da Praça 94, Alfama",
      description: "Meet at the entrance",
      lat: 38.7107,
      lng: -9.1305,
    },
    rating: 4.9,
    reviewCount: 145,
    publishedAt: Date.now() - 86400000 * 10,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
    availableLanguages: ["en", "pt"],
  },
  {
    _id: "event-2",
    slug: "porto-wine-harvest-festival",
    title: "Porto Wine Harvest Festival 2025",
    subtitle: "Celebrate the grape harvest in Douro Valley",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Be part of the annual grape harvest celebration in the Douro Valley. Participate in traditional grape stomping, enjoy wine tastings, and experience the vibrant atmosphere of this centuries-old tradition." }] },
      ]
    },
    originalLanguage: "en",
    location: "Porto",
    venue: "Quinta do Vallado",
    eventDate: futureDate(45),
    endDate: futureDate(47),
    isFeatured: true,
    isActive: true,
    status: "published",
    maxCapacity: 100,
    privatePrice: 180,
    sharedPrice: 45,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (1).png",
    galleryImageUrls: [],
    included: [
      "All activities",
      "Wine tastings",
      "Lunch both days",
      "Accommodation",
    ],
    excluded: [
      "Transport to/from Porto",
      "Personal expenses",
    ],
    tags: ["Festival", "Wine", "Cultural"],
    meetingPoint: {
      title: "Quinta do Vallado",
      address: "Vilarinho dos Freires, Peso da Régua",
      lat: 41.1591,
      lng: -7.7949,
    },
    rating: 4.8,
    reviewCount: 89,
    publishedAt: Date.now() - 86400000 * 30,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 5,
    availableLanguages: ["en", "pt", "es"],
  },
  {
    _id: "event-3",
    slug: "sintra-night-tour",
    title: "Mystical Night at Quinta da Regaleira",
    subtitle: "Explore Sintra's most mysterious palace after dark",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Discover the secrets and mysteries of Quinta da Regaleira in a special nighttime tour. Walk through illuminated gardens, descend into the initiation well, and hear the legends that make this place truly magical." }] },
      ]
    },
    originalLanguage: "pt",
    location: "Sintra",
    venue: "Quinta da Regaleira",
    eventDate: futureDate(7),
    endDate: futureDate(7) + 3600000 * 3,
    isFeatured: true,
    isActive: true,
    status: "published",
    maxCapacity: 30,
    privatePrice: 45,
    sharedPrice: 15,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (3).png",
    galleryImageUrls: [],
    included: [
      "Entry ticket",
      "Guided tour",
      "Flashlight",
    ],
    excluded: [
      "Transport",
      "Food & drinks",
    ],
    tags: ["Night Tour", "Mystery", "Sintra"],
    meetingPoint: {
      title: "Quinta da Regaleira Entrance",
      address: "Rua Barbosa du Bocage 5, Sintra",
      lat: 38.7965,
      lng: -9.3961,
    },
    rating: 4.9,
    reviewCount: 67,
    publishedAt: Date.now() - 86400000 * 5,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000,
    availableLanguages: ["pt", "en"],
  },
  {
    _id: "event-4",
    slug: "algarve-seafood-festival",
    title: "Algarve Seafood & Jazz Festival",
    subtitle: "Fresh seafood meets smooth jazz on the coast",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Indulge in the finest Algarve seafood while enjoying live jazz performances. This beachfront festival combines the best of local cuisine with international music talent." }] },
      ]
    },
    originalLanguage: "en",
    location: "Algarve",
    venue: "Praia da Rocha",
    eventDate: futureDate(30),
    endDate: futureDate(32),
    isFeatured: false,
    isActive: true,
    status: "published",
    maxCapacity: 500,
    privatePrice: 35,
    sharedPrice: 15,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (2).png",
    galleryImageUrls: [],
    included: [
      "Entry to festival",
      "Welcome drink",
    ],
    excluded: [
      "Food",
      "Additional drinks",
      "Parking",
    ],
    tags: ["Festival", "Food", "Music"],
    meetingPoint: {
      title: "Festival Entrance",
      address: "Praia da Rocha, Portimão",
      lat: 37.1198,
      lng: -8.5371,
    },
    rating: 4.5,
    reviewCount: 234,
    publishedAt: Date.now() - 86400000 * 45,
    createdAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now() - 86400000 * 10,
    availableLanguages: ["en"],
  },
]

export const MOCK_FEATURED_EVENTS = MOCK_EVENTS.filter(e => e.isFeatured)
export const MOCK_UPCOMING_EVENTS = MOCK_EVENTS.filter(e => e.eventDate > Date.now()).sort((a, b) => a.eventDate - b.eventDate)
export const MOCK_EVENT_LOCATIONS = [...new Set(MOCK_EVENTS.map(e => e.location))]
