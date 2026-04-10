export interface MockTour {
  _id: string
  slug: string
  title: string
  subtitle: string
  description: any
  tourType: string
  originalLanguage: string
  category: "tours" | "experiences" | "private"
  destination: string
  isFeatured: boolean
  isBestSeller: boolean
  isActive: boolean
  status: "draft" | "published" | "archived"
  duration: string
  durationMinutes: number
  groupSize: string
  maxGroupSize: number
  languages: string[]
  basePrice: number
  originalPrice: number
  currency: string
  bannerImageUrl: string
  galleryImageUrls: string[]

  included: string[]
  excluded: string[]
  tags: string[]
  pickup: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  dropoff: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  mapCenter: {
    lat: number
    lng: number
  }
  rating: number
  reviewCount: number
  cancellationPolicy: string
  publishedAt: number
  createdAt: number
  updatedAt: number
  availableLanguages: string[]
  stops: MockTourStop[]
  reviews: MockReview[]
}

export interface MockTourStop {
  _id: string
  tourId: string
  order: number
  time: string
  title: string
  description: string
  imageUrl?: string
  showImage: boolean
}

export interface MockReview {
  _id: string
  author: string
  avatar?: string
  rating: number
  text: string
  source?: string
}

export const MOCK_TOURS: MockTour[] = [
  {
    _id: "tour-1",
    slug: "sintra-day-trip",
    title: "Atlantic Soul – Lisbon, Alentejo & Algarve in a Coast",
    subtitle: "Discover the magical palaces and gardens of Sintra",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Let yourself be carried away on a premium multi-day escape through Portugal's most soulful coastline – from the cosmopolitan charm of Lisbon to the rustic elegance of Alentejo and the golden serenity of the Algarve. Crafted for discerning travelers seeking beauty, privacy and tailored luxury, Alma Atlântica is not just a tour – it's a curated experience of land, sea and sky." }] },
      ]
    },
    tourType: "Private Tour",
    originalLanguage: "en",
    category: "private",
    destination: "Lisbon",
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    status: "published",
    duration: "4 to 6 Days",
    durationMinutes: 5760,
    groupSize: "1 to 16 people",
    maxGroupSize: 16,
    languages: ["Portuguese", "English"],
    basePrice: 12000,
    originalPrice: 15000,
    currency: "EUR",
    bannerImageUrl: "/mockup-tours-details/Frame 1171275668.png",
    galleryImageUrls: [
      "/mockup-tours-details/Frame 1171275668.png",
      "/mockup-tours-details/Frame 1171275668.png",
    ],
    included: [
      "Private luxury vehicle & chauffeur",
      "Local expert concierge / host",
      "5-star boutique hotels or villas",
      "Custom experiences (by themes)",
      "Airport transfers",
      "Welcome pack with itinerary",
    ],
    excluded: [
      "Flights to/from Portugal",
      "Travel insurance (optional add-on)",
      "Upgrade (spa, balance)",
    ],
    tags: ["Private", "4 to 6 Days", "Custom Themes", "From €12,000", "1 to 16 people"],
    pickup: {
      title: "Hard Rock Café - Av. da Liberdade 2",
      address: "Or meet at Hard Rock Cafe na Praça dos Restauradores - Estação do Rossio",
      description: "Encontra-nos aqui",
      lat: 38.7167,
      lng: -9.1440,
    },
    dropoff: {
      title: "Dropoff",
      address: "Igual ao ponto de encontro",
      lat: 38.7167,
      lng: -9.1440,
    },
    mapCenter: { lat: 38.7223, lng: -9.1393 },
    rating: 4.9,
    reviewCount: 320,
    cancellationPolicy: "Free cancellation up to 24 hours before the tour starts. No refund for cancellations made less than 24 hours before departure.",
    publishedAt: Date.now() - 86400000 * 30,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000,
    availableLanguages: ["en", "pt", "es"],
    stops: [
      {
        _id: "stop-1",
        tourId: "tour-1",
        order: 0,
        time: "09:00",
        title: "Partida de Lisboa",
        description: "We'll pick you up from your hotel in Lisbon",
        imageUrl: "/mockup-tours-details/Frame 1171275668.png",
        showImage: true,
      },
      {
        _id: "stop-2",
        tourId: "tour-1",
        order: 1,
        time: "10:30",
        title: "Parque do Palácio da Pena",
        description: "Explore the stunning Pena Palace with its vibrant colors",
        imageUrl: "/mockup-tours-details/Frame 1171275668.png",
        showImage: true,
      },
      {
        _id: "stop-3",
        tourId: "tour-1",
        order: 2,
        time: "12:00",
        title: "Visita Guiada no Interior do Palácio da Pena",
        description: "Guided tour inside the palace",
        imageUrl: "/mockup-tours-details/Frame 1171275668.png",
        showImage: true,
      },
      {
        _id: "stop-4",
        tourId: "tour-1",
        order: 3,
        time: "14:00",
        title: "Exterior do Palácio da Pena",
        description: "Explore the exterior and gardens",
        imageUrl: "/mockup-tours-details/Frame 1171275668.png",
        showImage: true,
      },
      {
        _id: "stop-5",
        tourId: "tour-1",
        order: 4,
        time: "15:30",
        title: "Centro Histórico de Sintra",
        description: "Walk through the historic town center",
        imageUrl: "/mockup-tours-details/Frame 1171275668.png",
        showImage: true,
      },
      {
        _id: "stop-6",
        tourId: "tour-1",
        order: 5,
        time: "17:00",
        title: "Cabo da Roca",
        description: "Visit the westernmost point of continental Europe",
        imageUrl: "/mockup-tours-details/Frame 1171275668.png",
        showImage: true,
      },
    ],
    reviews: [
      {
        _id: "review-1",
        author: "Maria Silva",
        rating: 5,
        text: "This was my first time visiting Lisbon, first time visiting Europe. I signed up for a tour to Sintra, and Cascais. Loved it. Bravo our tour guide was awesome, very knowledgeable, friendly, patient and professional.",
        source: "Google",
      },
      {
        _id: "review-2",
        author: "João Santos",
        rating: 5,
        text: "Lorem ipsum sit amet, interdum vestibulum quam in sit conquer ariel nunc erisam ultrici a dictum acualis erat ultrisi quisque.",
        source: "Google",
      },
    ],
  },
  {
    _id: "tour-2",
    slug: "lisbon-city-tour",
    title: "Lisbon City Tour with Belém & Alfama",
    subtitle: "Explore the best of Lisbon in one day",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Discover the vibrant streets of Lisbon, from the historic Alfama district to the monumental grandeur of Belém. This full-day tour covers all the highlights of Portugal's capital." }] },
      ]
    },
    tourType: "Group Tour",
    originalLanguage: "en",
    category: "tours",
    destination: "Lisbon",
    isFeatured: true,
    isBestSeller: false,
    isActive: true,
    status: "published",
    duration: "8 hours",
    durationMinutes: 480,
    groupSize: "Up to 12 people",
    maxGroupSize: 12,
    languages: ["English", "Portuguese", "Spanish"],
    basePrice: 85,
    originalPrice: 100,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668.png",
    galleryImageUrls: [],
    included: [
      "Professional guide",
      "Air-conditioned vehicle",
      "Pastéis de nata tasting",
    ],
    excluded: [
      "Lunch",
      "Monument entrance fees",
    ],
    tags: ["Group", "Full Day", "City Tour"],
    pickup: {
      title: "Praça do Comércio",
      address: "Meet at the statue",
      lat: 38.7075,
      lng: -9.1364,
    },
    dropoff: {
      title: "Praça do Comércio",
      address: "Same as pickup",
      lat: 38.7075,
      lng: -9.1364,
    },
    mapCenter: { lat: 38.7169, lng: -9.1399 },
    rating: 4.8,
    reviewCount: 256,
    cancellationPolicy: "Free cancellation up to 24 hours before the tour starts.",
    publishedAt: Date.now() - 86400000 * 20,
    createdAt: Date.now() - 86400000 * 50,
    updatedAt: Date.now() - 86400000 * 5,
    availableLanguages: ["en", "pt"],
    stops: [],
    reviews: [],
  },
  {
    _id: "tour-3",
    slug: "porto-wine-experience",
    title: "Porto Wine Tasting & Douro Valley",
    subtitle: "Premium wine experience in Porto",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Experience the world-famous Port wine in its birthplace. Visit historic wine cellars and enjoy tastings with stunning views of the Douro Valley." }] },
      ]
    },
    tourType: "Experience",
    originalLanguage: "en",
    category: "experiences",
    destination: "Porto",
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    status: "published",
    duration: "6 hours",
    durationMinutes: 360,
    groupSize: "Up to 8 people",
    maxGroupSize: 8,
    languages: ["English", "Portuguese"],
    basePrice: 120,
    originalPrice: 150,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (1).png",
    galleryImageUrls: [],
    included: [
      "Wine tastings",
      "Cheese platter",
      "Expert sommelier",
      "Transport between cellars",
    ],
    excluded: [
      "Hotel pickup",
      "Lunch",
    ],
    tags: ["Experience", "Wine", "Porto"],
    pickup: {
      title: "Ribeira Square",
      address: "Porto Ribeira",
      lat: 41.1410,
      lng: -8.6131,
    },
    dropoff: {
      title: "Ribeira Square",
      address: "Porto Ribeira",
      lat: 41.1410,
      lng: -8.6131,
    },
    mapCenter: { lat: 41.1496, lng: -8.6109 },
    rating: 4.9,
    reviewCount: 189,
    cancellationPolicy: "Free cancellation up to 48 hours before.",
    publishedAt: Date.now() - 86400000 * 15,
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 3,
    availableLanguages: ["en"],
    stops: [],
    reviews: [],
  },
  {
    _id: "tour-4",
    slug: "algarve-coastal-adventure",
    title: "Algarve Coastal Adventure & Caves",
    subtitle: "Explore the stunning Algarve coastline",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Discover the breathtaking cliffs, hidden beaches, and sea caves of the Algarve coast on this unforgettable adventure." }] },
      ]
    },
    tourType: "Adventure Tour",
    originalLanguage: "en",
    category: "tours",
    destination: "Algarve",
    isFeatured: false,
    isBestSeller: true,
    isActive: true,
    status: "published",
    duration: "Full Day",
    durationMinutes: 600,
    groupSize: "Up to 10 people",
    maxGroupSize: 10,
    languages: ["English"],
    basePrice: 95,
    originalPrice: 110,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (2).png",
    galleryImageUrls: [],
    included: [
      "Boat tour",
      "Snorkeling equipment",
      "Picnic lunch",
      "Guide",
    ],
    excluded: [
      "Hotel transfer",
    ],
    tags: ["Adventure", "Boat", "Caves"],
    pickup: {
      title: "Lagos Marina",
      address: "Marina de Lagos",
      lat: 37.1028,
      lng: -8.6739,
    },
    dropoff: {
      title: "Lagos Marina",
      address: "Marina de Lagos",
      lat: 37.1028,
      lng: -8.6739,
    },
    mapCenter: { lat: 37.0893, lng: -8.6756 },
    rating: 4.7,
    reviewCount: 312,
    cancellationPolicy: "Free cancellation up to 24 hours before.",
    publishedAt: Date.now() - 86400000 * 10,
    createdAt: Date.now() - 86400000 * 40,
    updatedAt: Date.now() - 86400000 * 2,
    availableLanguages: ["en", "es"],
    stops: [],
    reviews: [],
  },
  {
    _id: "tour-5",
    slug: "cascais-sintra-private",
    title: "Private Cascais & Sintra Day Trip",
    subtitle: "Exclusive private tour of two magical destinations",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Combine the coastal charm of Cascais with the fairytale atmosphere of Sintra on this luxurious private day trip." }] },
      ]
    },
    tourType: "Private Tour",
    originalLanguage: "pt",
    category: "private",
    destination: "Sintra",
    isFeatured: true,
    isBestSeller: false,
    isActive: true,
    status: "published",
    duration: "10 hours",
    durationMinutes: 600,
    groupSize: "1 to 6 people",
    maxGroupSize: 6,
    languages: ["Portuguese", "English", "Spanish", "French"],
    basePrice: 350,
    originalPrice: 400,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (3).png",
    galleryImageUrls: [],
    included: [
      "Private vehicle",
      "Professional driver/guide",
      "Hotel pickup & dropoff",
      "Bottled water",
    ],
    excluded: [
      "Palace entrance fees",
      "Lunch",
    ],
    tags: ["Private", "Sintra", "Cascais"],
    pickup: {
      title: "Your Hotel",
      address: "Lisbon area hotel",
      lat: 38.7223,
      lng: -9.1393,
    },
    dropoff: {
      title: "Your Hotel",
      address: "Lisbon area hotel",
      lat: 38.7223,
      lng: -9.1393,
    },
    mapCenter: { lat: 38.7970, lng: -9.3900 },
    rating: 5.0,
    reviewCount: 87,
    cancellationPolicy: "Free cancellation up to 48 hours before.",
    publishedAt: Date.now() - 86400000 * 8,
    createdAt: Date.now() - 86400000 * 35,
    updatedAt: Date.now() - 86400000,
    availableLanguages: ["pt", "en", "es", "fr"],
    stops: [],
    reviews: [],
  },
  {
    _id: "tour-6",
    slug: "fatima-nazare-obidos",
    title: "Fátima, Nazaré & Óbidos Full Day Tour",
    subtitle: "Sacred sites and medieval charm",
    description: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Visit the famous sanctuary of Fátima, witness the giant waves of Nazaré, and explore the medieval town of Óbidos on this spiritual and cultural journey." }] },
      ]
    },
    tourType: "Group Tour",
    originalLanguage: "en",
    category: "tours",
    destination: "Fátima",
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    status: "published",
    duration: "9 hours",
    durationMinutes: 540,
    groupSize: "Up to 15 people",
    maxGroupSize: 15,
    languages: ["English", "Spanish"],
    basePrice: 75,
    originalPrice: 90,
    currency: "EUR",
    bannerImageUrl: "/mockup_tour_picks/Frame 1171275668 (4).png",
    galleryImageUrls: [],
    included: [
      "Transport",
      "Guide",
      "Ginjinha tasting in Óbidos",
    ],
    excluded: [
      "Lunch",
      "Tips",
    ],
    tags: ["Cultural", "Religious", "Full Day"],
    pickup: {
      title: "Marquês de Pombal",
      address: "Lisbon city center",
      lat: 38.7252,
      lng: -9.1500,
    },
    dropoff: {
      title: "Marquês de Pombal",
      address: "Lisbon city center",
      lat: 38.7252,
      lng: -9.1500,
    },
    mapCenter: { lat: 39.6317, lng: -8.6700 },
    rating: 4.6,
    reviewCount: 198,
    cancellationPolicy: "Free cancellation up to 24 hours before.",
    publishedAt: Date.now() - 86400000 * 25,
    createdAt: Date.now() - 86400000 * 55,
    updatedAt: Date.now() - 86400000 * 7,
    availableLanguages: ["en", "es"],
    stops: [],
    reviews: [],
  },
]

export const MOCK_FEATURED_TOURS = MOCK_TOURS.filter(t => t.isFeatured)
export const MOCK_BESTSELLER_TOURS = MOCK_TOURS.filter(t => t.isBestSeller)
export const MOCK_DESTINATIONS = [...new Set(MOCK_TOURS.map(t => t.destination))]
