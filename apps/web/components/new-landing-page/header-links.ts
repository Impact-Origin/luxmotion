/** Shared destinations for the site header and the checkout's mobile menu. */
export function getHeaderLinks(t: (key: string) => string) {
  return [
    { href: "/", label: t("home"), hasDropdown: false, items: [] },
    { href: "/about-us", label: t("aboutUs"), hasDropdown: false, items: [] },
    { href: "/fleet", label: t("fleet"), hasDropdown: false, items: [] },
    {
      label: t("services"),
      hasDropdown: true,
      items: [
        { href: "/tours", label: t("tours") },
        { href: "/events", label: t("events") },
        { href: "/ultra-luxury-tours", label: t("luxuryTours") },
        { href: "/corporate", label: t("corporate") },
        { href: "/wedding", label: t("weddings") },
        { href: "/schools", label: t("school") },
      ],
    },
    {
      label: t("forPartners"),
      hasDropdown: true,
      items: [
        { href: "/hotels", label: t("hotels") },
        { href: "/partner-guide", label: t("partnerGuide") },
        { href: "/wedding-planner", label: t("weddingPlanners") },
      ],
    },
    {
      label: t("forDrivers"),
      hasDropdown: true,
      items: [
        { href: "/drivers", label: t("individualDrivers") },
        { href: "/partners", label: t("driverCompanies") },
      ],
    },
    { href: "/blogs", label: t("blog"), hasDropdown: false, items: [] },
  ]
}
