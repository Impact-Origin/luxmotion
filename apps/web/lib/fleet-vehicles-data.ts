import type { FleetVehicle } from "@/components/fleet/fleet-vehicle-card-dark"

export const STANDARD_VEHICLES: FleetVehicle[] = [
  {
    id: "fiat-tipo-station",
    name: "Fiat Tipo Station",
    image: "/fleet/vehicles/fiat-tipo-station.png",
    badges: ["available"],
    paxMin: 1,
    paxMax: 3,
    bags: 3,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "dacia-sandero",
    name: "Dacia Sandero ECO-G 100",
    image: "/fleet/vehicles/dacia-sandero.png",
    badges: ["available"],
    paxMin: 1,
    paxMax: 3,
    bags: 3,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "peugeot-e208",
    name: "Peugeot e-208",
    image: "/fleet/vehicles/peugeot-e208.png",
    badges: ["eco", "electric"],
    paxMin: 1,
    paxMax: 3,
    bags: 3,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "renault-clio",
    name: "Renault Clio",
    image: "/fleet/vehicles/renault-clio.png",
    badges: ["available"],
    paxMin: 1,
    paxMax: 3,
    bags: 3,
    hasAc: true,
    hasWifi: true,
  },
]

export const XL_VEHICLES: FleetVehicle[] = [
  {
    id: "renault-grand-scenic",
    name: "Renault Grand Scenic",
    image: "/fleet/vehicles/renault-grand-scenic.png",
    badges: ["available"],
    paxMin: 3,
    paxMax: 4,
    bags: 4,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "citroen-c4-grand-picasso",
    name: "Citroën C4 Grand Picasso",
    image: "/fleet/vehicles/citroen-c4-grand-picasso.png",
    badges: ["available"],
    paxMin: 3,
    paxMax: 4,
    bags: 4,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "kia-ev6",
    name: "KIA EV6",
    image: "/fleet/vehicles/kia-ev6.png",
    badges: ["available"],
    paxMin: 3,
    paxMax: 4,
    bags: 4,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "kia-niro",
    name: "KIA Niro",
    image: "/fleet/vehicles/kia-niro.png",
    badges: ["available"],
    paxMin: 3,
    paxMax: 4,
    bags: 4,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "dacia-jogger",
    name: "Dacia Jogger",
    image: "/fleet/vehicles/dacia-jogger.png",
    badges: ["available"],
    paxMin: 3,
    paxMax: 4,
    bags: 4,
    hasAc: true,
    hasWifi: true,
  },
]

const execBase = (
  id: string,
  name: string,
  image: string,
  badges: FleetVehicle["badges"],
  images?: string[],
): FleetVehicle => ({
  id,
  name,
  image,
  images,
  badges,
  paxMin: 1,
  paxMax: 3,
  bags: 3,
  hasAc: true,
  hasWifi: true,
})

export const EXECUTIVE_VEHICLES: FleetVehicle[] = [
  execBase("mercedes-s400", "Mercedes S400", "/fleet/vehicles/mercedes-s400.png", ["available"]),
  execBase("porsche-panamera", "Porsche Panamera", "/fleet/vehicles/porsche-panamera.png", ["available"]),
  execBase("tesla-model-y", "Tesla Model Y", "/fleet/vehicles/tesla-model-y.png", ["eco", "electric"]),
  execBase("mercedes-eqe", "Mercedes EQE", "/fleet/vehicles/mercedes-eqe.png", ["eco", "electric"]),
  execBase("bentley-flying-spur", "Bentley Flying Spur", "/fleet/vehicles/bentley-flying-spur.png", ["available"]),
  execBase("mercedes-eqs", "Mercedes EQS", "/fleet/vehicles/mercedes-eqs.png", ["eco", "electric"]),
  execBase("mercedes-s-class", "Mercedes S Class", "/fleet/vehicles/mercedes-s-class.png", ["available"]),
  execBase("mercedes-e-class-station", "Mercedes E Class Station", "/fleet/vehicles/mercedes-e-class-station.png", ["available"]),
  execBase("tesla-model-s", "Tesla Model S", "/fleet/vehicles/tesla-model-s.png", ["eco", "electric"]),
]

export const MINIBUS_VEHICLES: FleetVehicle[] = [
  {
    id: "mercedes-sprinter",
    name: "Mercedes Sprinter",
    image: "/fleet/vehicles/mercedes-sprinter.png",
    badges: ["available"],
    paxMin: 9,
    paxMax: 16,
    bags: 15,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "ford-transit",
    name: "Ford Transit",
    image: "/fleet/vehicles/ford-transit.png",
    badges: ["available"],
    paxMin: 10,
    paxMax: 22,
    bags: 20,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "mercedes-maybach-sprinter",
    name: "Mercedes Maybach Sprinter",
    image: "/fleet/vehicles/mercedes-maybach-sprinter.webp",
    badges: ["available"],
    paxMin: 10,
    paxMax: 22,
    bags: 20,
    hasAc: true,
    hasWifi: true,
  },
]

export const COACH_VEHICLES: FleetVehicle[] = [
  {
    id: "standard-coach",
    name: "Standard Coach",
    image: "/fleet/vehicles/standard-coach.png",
    badges: ["available"],
    paxMin: 20,
    paxMax: 56,
    bags: 50,
    hasAc: true,
    hasWifi: true,
  },
  {
    id: "executive-coach",
    name: "Executive Coach",
    image: "/fleet/vehicles/executive-coach.png",
    badges: ["available"],
    paxMin: 20,
    paxMax: 56,
    bags: 50,
    hasAc: true,
    hasWifi: true,
  },
]

// A V-Class and an EQV seat one fewer than the rest of the van line-up.
const vanBase = (
  id: string,
  name: string,
  image: string,
  badges: FleetVehicle["badges"],
  { paxMax = 8, bags = 8, images }: { paxMax?: number; bags?: number; images?: string[] } = {},
): FleetVehicle => ({
  id,
  name,
  image,
  images,
  badges,
  paxMin: 5,
  paxMax,
  bags,
  hasAc: true,
  hasWifi: true,
})

export const VAN_VEHICLES: FleetVehicle[] = [
  vanBase("mercedes-vito", "Mercedes Vito", "/fleet/vehicles/mercedes-vito.png", ["available"]),
  vanBase("peugeot-traveller", "Peugeot Traveller", "/fleet/vehicles/peugeot-traveller.png", ["eco", "electric"]),
  vanBase("toyota-hiace", "Toyota HiAce", "/fleet/vehicles/toyota-hiace.png", ["available"]),
  vanBase("mercedes-v-class", "Mercedes V-Class", "/fleet/van/Mercedes V Class.webp", ["available"], { paxMax: 7, bags: 7 }),
  vanBase("mercedes-eqv-2025", "Mercedes EQV 2025", "/fleet/van/Van executiva.webp", ["eco", "electric"], { paxMax: 7, bags: 7 }),
  {
    id: "mercedes-maybach-v-class-2025",
    name: "Van Mercedes Maybach Class V 2025",
    image: "/fleet/van/mercedes-maybach-v-class-2025.webp",
    badges: ["available"],
    paxMin: 2,
    paxMax: 5,
    bags: 6,
    hasAc: true,
    hasWifi: true,
  },
]

// Clássicos e veículos de coleção. As capacidades são as lotações reais destes
// modelos — confirmar antes de abrir a reservas, se for esse o caso.
const classic = (
  id: string,
  name: string,
  photos: string[],
  paxMax: number,
  bags: number,
): FleetVehicle => ({
  id,
  name,
  image: photos[0]!,
  images: photos,
  badges: ["available"],
  paxMin: 1,
  paxMax,
  bags,
  hasAc: false,
  hasWifi: false,
})

const p = (...names: string[]) => names.map((n) => `/fleet/v/${n}.webp`)

export const CLASSIC_VEHICLES: FleetVehicle[] = [
  classic("porsche-356-speedster", "Porsche 356 Speedster", p("porsche-356-1"), 2, 1),
]
