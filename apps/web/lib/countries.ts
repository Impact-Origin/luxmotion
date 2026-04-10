/**
 * ISO 3166-1 alpha-2 country codes and name variants for nationality flag display.
 * Names in Portuguese (pt), English (en), Spanish (es), French (fr), German (de).
 */
const COUNTRIES: { code: string; names: string[] }[] = [
  { code: "PT", names: ["Portugal", "Portuguese", "Portuguesa", "Português"] },
  { code: "ES", names: ["Spain", "Espanha", "España", "Spanish"] },
  { code: "FR", names: ["France", "França", "French"] },
  { code: "DE", names: ["Germany", "Alemanha", "Deutschland", "German"] },
  { code: "IT", names: ["Italy", "Itália", "Italia", "Italian"] },
  { code: "NL", names: ["Netherlands", "Países Baixos", "Dutch", "Holanda"] },
  { code: "BE", names: ["Belgium", "Bélgica", "Belgian"] },
  { code: "GB", names: ["United Kingdom", "Reino Unido", "UK", "England", "Inglaterra", "British"] },
  { code: "IE", names: ["Ireland", "Irlanda", "Irish"] },
  { code: "US", names: ["United States", "USA", "Estados Unidos", "America", "American"] },
  { code: "BR", names: ["Brazil", "Brasil", "Brazilian"] },
  { code: "AR", names: ["Argentina", "Argentine"] },
  { code: "MX", names: ["Mexico", "México", "Mexican"] },
  { code: "CH", names: ["Switzerland", "Suíça", "Swiss"] },
  { code: "AT", names: ["Austria", "Áustria", "Austrian"] },
  { code: "PL", names: ["Poland", "Polónia", "Polish"] },
  { code: "RU", names: ["Russia", "Rússia", "Russian"] },
  { code: "UA", names: ["Ukraine", "Ucrânia", "Ukrainian"] },
  { code: "CZ", names: ["Czech Republic", "República Checa", "Czech"] },
  { code: "SE", names: ["Sweden", "Suécia", "Swedish"] },
  { code: "NO", names: ["Norway", "Noruega", "Norwegian"] },
  { code: "DK", names: ["Denmark", "Dinamarca", "Danish"] },
  { code: "FI", names: ["Finland", "Finlândia", "Finnish"] },
  { code: "GR", names: ["Greece", "Grécia", "Greek"] },
  { code: "TR", names: ["Turkey", "Turquia", "Turkish"] },
  { code: "JP", names: ["Japan", "Japão", "Japanese"] },
  { code: "CN", names: ["China", "Chinese"] },
  { code: "KR", names: ["South Korea", "Coreia do Sul", "Korean"] },
  { code: "IN", names: ["India", "Indian"] },
  { code: "AU", names: ["Australia", "Australian"] },
  { code: "NZ", names: ["New Zealand", "Nova Zelândia"] },
  { code: "CA", names: ["Canada", "Canadian"] },
  { code: "ZA", names: ["South Africa", "África do Sul"] },
  { code: "IL", names: ["Israel", "Israeli"] },
  { code: "EG", names: ["Egypt", "Egito", "Egyptian"] },
  { code: "MA", names: ["Morocco", "Marrocos", "Moroccan"] },
  { code: "LU", names: ["Luxembourg", "Luxemburgo"] },
  { code: "HU", names: ["Hungary", "Hungria", "Hungarian"] },
  { code: "RO", names: ["Romania", "Roménia", "Romanian"] },
  { code: "BG", names: ["Bulgaria", "Búlgaria", "Bulgarian"] },
  { code: "HR", names: ["Croatia", "Croácia", "Croatian"] },
  { code: "SI", names: ["Slovenia", "Eslovénia", "Slovenian"] },
  { code: "SK", names: ["Slovakia", "Eslováquia", "Slovak"] },
  { code: "RS", names: ["Serbia", "Sérvia", "Serbian"] },
  { code: "BA", names: ["Bosnia", "Bósnia", "Bosnian"] },
  { code: "ME", names: ["Montenegro", "Montenegrin"] },
  { code: "MK", names: ["North Macedonia", "Macedónia do Norte", "Macedonian"] },
  { code: "AL", names: ["Albania", "Albanês"] },
  { code: "EE", names: ["Estonia", "Estónia", "Estonian"] },
  { code: "LV", names: ["Latvia", "Letónia", "Latvian"] },
  { code: "LT", names: ["Lithuania", "Lituânia", "Lithuanian"] },
  { code: "MD", names: ["Moldova", "Moldovan"] },
  { code: "BY", names: ["Belarus", "Bielorrússia", "Belarusian"] },
  { code: "GE", names: ["Georgia", "Geórgia", "Georgian"] },
  { code: "AM", names: ["Armenia", "Arménia", "Armenian"] },
  { code: "AZ", names: ["Azerbaijan", "Azerbaijão", "Azerbaijani"] },
  { code: "KZ", names: ["Kazakhstan", "Cazaquistão", "Kazakh"] },
  { code: "UZ", names: ["Uzbekistan", "Uzbequistão", "Uzbek"] },
  { code: "UY", names: ["Uruguay", "Uruguayan"] },
  { code: "CL", names: ["Chile", "Chilean"] },
  { code: "CO", names: ["Colombia", "Colombian"] },
  { code: "PE", names: ["Peru", "Peruvian"] },
  { code: "EC", names: ["Ecuador", "Equador", "Ecuadorian"] },
  { code: "VE", names: ["Venezuela", "Venezuelan"] },
  { code: "BO", names: ["Bolivia", "Bolívia", "Bolivian"] },
  { code: "PY", names: ["Paraguay", "Paraguaio"] },
  { code: "CR", names: ["Costa Rica", "Costa Rican"] },
  { code: "PA", names: ["Panama", "Panamá", "Panamanian"] },
  { code: "CU", names: ["Cuba", "Cuban"] },
  { code: "DO", names: ["Dominican Republic", "República Dominicana", "Dominican"] },
  { code: "JM", names: ["Jamaica", "Jamaican"] },
  { code: "PR", names: ["Puerto Rico", "Porto Rico"] },
  { code: "PH", names: ["Philippines", "Filipinas", "Filipino"] },
  { code: "TH", names: ["Thailand", "Tailândia", "Thai"] },
  { code: "VN", names: ["Vietnam", "Vietname", "Vietnamese"] },
  { code: "MY", names: ["Malaysia", "Malaísia", "Malaysian"] },
  { code: "SG", names: ["Singapore", "Singapura", "Singaporean"] },
  { code: "ID", names: ["Indonesia", "Indonésia", "Indonesian"] },
  { code: "PK", names: ["Pakistan", "Paquistão", "Pakistani"] },
  { code: "BD", names: ["Bangladesh", "Bangladeshi"] },
  { code: "SA", names: ["Saudi Arabia", "Arábia Saudita", "Saudi"] },
  { code: "AE", names: ["United Arab Emirates", "Emirados Árabes Unidos", "Emirati"] },
  { code: "QA", names: ["Qatar", "Catar", "Qatari"] },
  { code: "KW", names: ["Kuwait", "Kuwaiti"] },
  { code: "LB", names: ["Lebanon", "Líbano", "Lebanese"] },
  { code: "JO", names: ["Jordan", "Jordânia", "Jordanian"] },
  { code: "KE", names: ["Kenya", "Quénia", "Kenyan"] },
  { code: "NG", names: ["Nigeria", "Nigéria", "Nigerian"] },
  { code: "GH", names: ["Ghana", "Ganês"] },
  { code: "TZ", names: ["Tanzania", "Tanzânia", "Tanzanian"] },
  { code: "ET", names: ["Ethiopia", "Etiópia", "Ethiopian"] },
]

function getFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join("")
}

export type CountryOption = { value: string; label: string; flag: string; code: string }

/** Lista de países para dropdown, com label (nome principal) e flag emoji */
export const COUNTRY_OPTIONS: CountryOption[] = COUNTRIES.map((c) => ({
  value: c.names[0]!,
  label: c.names[0]!,
  flag: getFlagEmoji(c.code),
  code: c.code,
})).sort((a, b) => a.label.localeCompare(b.label))

export function getFlagForNationality(nationality: string): string | null {
  const trimmed = nationality.trim()
  if (!trimmed) return null

  const lower = trimmed.toLowerCase()
  const country = COUNTRIES.find((c) =>
    c.names.some((name) => name.toLowerCase() === lower)
  )
  return country ? getFlagEmoji(country.code) : null
}
