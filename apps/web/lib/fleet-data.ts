export interface FleetVehicle {
  id: string
  img: string
  title: string
  briefcase: number
  wifi: boolean
  passengers: number
  category: "standard" | "xl" | "executivo" | "van" | "minibus" | "autocarro"
  isElectric?: boolean
}

export const FLEET_BY_CATEGORY: FleetVehicle[][] = [
  [
    { id: "1", img: "/fleet/economic/Fiat tipo.webp", title: "Fiat Tipo Station", briefcase: 3, wifi: true, passengers: 4, category: "standard" },
    { id: "2", img: "/fleet/economic/Dacia sandero.webp", title: "Dacia Sandero ECO-G 100", briefcase: 3, wifi: true, passengers: 4, category: "standard" },
    { id: "3", img: "/fleet/economic/Pegeout e 208.webp", title: "Peugeot e-208", briefcase: 3, wifi: true, passengers: 4, category: "standard", isElectric: true },
    { id: "4", img: "/fleet/economic/renault clio 2024.webp", title: "Renault Clio", briefcase: 3, wifi: true, passengers: 4, category: "standard" },
  ],
  [
    { id: "5", img: "/fleet/xl/Renault Grand Scenic.webp", title: "Renault Grand Scenic", briefcase: 5, wifi: true, passengers: 5, category: "xl" },
    { id: "6", img: "/fleet/xl/Citroen C4 Grand Picasso.webp", title: "Citroen C4 Grand Picasso", briefcase: 5, wifi: true, passengers: 5, category: "xl" },
    { id: "7", img: "/fleet/xl/Kia Ev9.webp", title: "KIA EV9", briefcase: 5, wifi: true, passengers: 5, category: "xl", isElectric: true },
    { id: "8", img: "/fleet/xl/Kia niro.webp", title: "KIA Niro", briefcase: 5, wifi: true, passengers: 5, category: "xl" },
    { id: "9", img: "/fleet/xl/dacia jogger.webp", title: "Dacia Jogger", briefcase: 5, wifi: true, passengers: 5, category: "xl" },
  ],
  [
    { id: "10", img: "/fleet/executive/Sedan Executivo mercedes 2.webp", title: "Mercedes S400", briefcase: 4, wifi: true, passengers: 4, category: "executivo" },
    { id: "11", img: "/fleet/executive/Porsche panamera.webp", title: "Porsche Panamera", briefcase: 4, wifi: true, passengers: 4, category: "executivo" },
    { id: "12", img: "/fleet/executive/Tesla model y.webp", title: "Tesla Model Y", briefcase: 4, wifi: true, passengers: 4, category: "executivo", isElectric: true },
    { id: "13", img: "/fleet/executive/Van executiva.webp", title: "Mercedes EQV", briefcase: 8, wifi: true, passengers: 8, category: "executivo", isElectric: true },
    { id: "14", img: "/fleet/executive/Bentley_Flying Spur.webp", title: "Bentley Flying Spur", briefcase: 4, wifi: true, passengers: 4, category: "executivo" },
    { id: "15", img: "/fleet/executive/Mrecedes EQE Sedan.webp", title: "Mercedes EQE", briefcase: 2, wifi: true, passengers: 3, category: "executivo", isElectric: true },
    { id: "16", img: "/fleet/executive/Mercedes EQS Sedan.webp", title: "Mercedes EQS", briefcase: 2, wifi: true, passengers: 3, category: "executivo", isElectric: true },
    { id: "17", img: "/fleet/executive/Mercedes S Class.webp", title: "Mercedes S Class", briefcase: 2, wifi: true, passengers: 3, category: "executivo" },
    { id: "18", img: "/fleet/executive/Mercedes E Class Station.webp", title: "Mercedes E Class Station", briefcase: 3, wifi: true, passengers: 3, category: "executivo" },
    { id: "19", img: "/fleet/executive/Tesla modal S.webp", title: "Tesla Model S", briefcase: 3, wifi: true, passengers: 5, category: "executivo", isElectric: true },
  ],
  [
    { id: "20", img: "/fleet/van/Van executiva vito.webp", title: "Mercedes Vito", briefcase: 8, wifi: true, passengers: 8, category: "van" },
    { id: "21", img: "/fleet/van/Peugeot E-Traveler.webp", title: "Peugeot E-Traveler", briefcase: 8, wifi: true, passengers: 8, category: "van", isElectric: true },
    { id: "22", img: "/fleet/van/Toyota_hiace.webp", title: "Toyota HiAce", briefcase: 8, wifi: true, passengers: 8, category: "van" },
    { id: "23", img: "/fleet/van/Van executiva.webp", title: "Mercedes EQV", briefcase: 8, wifi: true, passengers: 8, category: "van", isElectric: true },
    { id: "24", img: "/fleet/van/Mercedes V Class.webp", title: "Mercedes V Class", briefcase: 7, wifi: true, passengers: 7, category: "van" },
  ],
  [
    { id: "25", img: "/fleet/minibus/Mercedes Sprinter mini bus.webp", title: "Mercedes Sprinter", briefcase: 16, wifi: true, passengers: 16, category: "minibus" },
    { id: "26", img: "/fleet/minibus/ford transit minibus-1.webp", title: "Ford Transit", briefcase: 16, wifi: true, passengers: 16, category: "minibus" },
  ],
  [
    { id: "27", img: "/fleet/autocar/Autocarro.webp", title: "Standard", briefcase: 56, wifi: true, passengers: 56, category: "autocarro" },
    { id: "28", img: "/fleet/autocar/bus-executive.webp", title: "Executive", briefcase: 56, wifi: true, passengers: 56, category: "autocarro" },
  ],
]
