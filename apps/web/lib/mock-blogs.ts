export interface MockBlog {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: any
  heroImageUrl: string
  category: string
  author: string
  originalLanguage: string
  status: "draft" | "published" | "archived"
  isFeatured: boolean
  readTimeMinutes: number
  publishedAt: number
  createdAt: number
  updatedAt: number
  availableLanguages: string[]
}

export const MOCK_FEATURED_BLOGS: MockBlog[] = [
  {
    _id: "mock-1",
    slug: "lisbon-airport-transfer-guide",
    title: "Airport to Lisbon City Center: Complete Transfer Guide 2024",
    excerpt: "Everything you need to know about getting from Lisbon Airport to your hotel, with options for every budget.",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Getting from Lisbon Airport" }] },
        { type: "paragraph", content: [{ type: "text", text: "Lisbon's Humberto Delgado Airport is the main international gateway to Portugal. Located just 7km from the city center, there are several convenient transfer options available." }] },
      ]
    },
    heroImageUrl: "/mockup-blogs/lisbon-city-center.jpg",
    category: "Lisbon",
    author: "EasyTransfer Team",
    originalLanguage: "en",
    status: "published",
    isFeatured: true,
    readTimeMinutes: 5,
    publishedAt: Date.now() - 86400000,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
    availableLanguages: ["en", "pt"],
  },
  {
    _id: "mock-2",
    slug: "porto-wine-tour-guide",
    title: "Porto Wine Tour: The Ultimate Guide to Douro Valley",
    excerpt: "Discover the best wineries and tasting experiences in the stunning Douro Valley region.",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Exploring Douro Valley" }] },
        { type: "paragraph", content: [{ type: "text", text: "The Douro Valley is one of the world's most beautiful wine regions, offering spectacular views and world-class Port wine." }] },
      ]
    },
    heroImageUrl: "/mockup-blogs/lisbon-city-center.jpg",
    category: "Porto",
    author: "EasyTransfer Team",
    originalLanguage: "en",
    status: "published",
    isFeatured: true,
    readTimeMinutes: 7,
    publishedAt: Date.now() - 86400000 * 3,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3,
    availableLanguages: ["en"],
  },
  {
    _id: "mock-3",
    slug: "sintra-day-trip-guide",
    title: "Sintra Day Trip: Palaces, Gardens & Hidden Gems",
    excerpt: "Plan the perfect day trip to Sintra with our comprehensive guide to this magical UNESCO town.",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Magical Sintra" }] },
        { type: "paragraph", content: [{ type: "text", text: "Sintra is a fairytale town nestled in the hills west of Lisbon, known for its romantic architecture and lush gardens." }] },
      ]
    },
    heroImageUrl: "/mockup-blogs/lisbon-city-center.jpg",
    category: "Sintra",
    author: "EasyTransfer Team",
    originalLanguage: "pt",
    status: "published",
    isFeatured: true,
    readTimeMinutes: 6,
    publishedAt: Date.now() - 86400000 * 5,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 5,
    availableLanguages: ["pt", "en", "es"],
  },
]

export const MOCK_LATEST_BLOGS: MockBlog[] = [
  ...MOCK_FEATURED_BLOGS,
  {
    _id: "mock-4",
    slug: "europe-fall-festivals-2025",
    title: "Europe's top 6 fall festivals for 2025",
    excerpt: "Everything you need to know about getting from Lisbon Airport to your hotel, with options for every budget.",
    content: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Fall in Europe is magical, with festivals celebrating harvest, culture, and local traditions." }] },
      ]
    },
    heroImageUrl: "/mockup-blogs/latest/1.webp",
    category: "Lisbon",
    author: "EasyTransfer Team",
    originalLanguage: "en",
    status: "published",
    isFeatured: false,
    readTimeMinutes: 4,
    publishedAt: Date.now() - 86400000 * 7,
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 7,
    availableLanguages: ["en"],
  },
  {
    _id: "mock-5",
    slug: "european-cruise-tips",
    title: "5 Tips for Planning a European Cruise Experience",
    excerpt: "Discover the best cruise ports and hidden gems along the Portuguese coast.",
    content: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Planning a European cruise can be overwhelming, but with these tips you'll have the trip of a lifetime." }] },
      ]
    },
    heroImageUrl: "/mockup-blogs/latest/2.webp",
    category: "Porto",
    author: "EasyTransfer Team",
    originalLanguage: "en",
    status: "published",
    isFeatured: false,
    readTimeMinutes: 5,
    publishedAt: Date.now() - 86400000 * 8,
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 8,
    availableLanguages: ["en", "pt"],
  },
  {
    _id: "mock-6",
    slug: "trade-shows-travel-agents-2026",
    title: "Top 5 Trade Shows for Travel Agents in 2026",
    excerpt: "Plan your visit to the magical palaces and gardens of Sintra.",
    content: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Stay ahead of the curve by attending these must-see travel industry trade shows in 2026." }] },
      ]
    },
    heroImageUrl: "/mockup-blogs/latest/3.webp",
    category: "Sintra",
    author: "EasyTransfer Team",
    originalLanguage: "en",
    status: "published",
    isFeatured: false,
    readTimeMinutes: 3,
    publishedAt: Date.now() - 86400000 * 10,
    createdAt: Date.now() - 86400000 * 11,
    updatedAt: Date.now() - 86400000 * 10,
    availableLanguages: ["en"],
  },
]
