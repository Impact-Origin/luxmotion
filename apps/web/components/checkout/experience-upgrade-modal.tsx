"use client";

import Image from "next/image";
import { X, Check, Flame } from "lucide-react";
import { useTranslations } from "next-intl";

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const;

/** Gold accent shared by both checkout stacks (EasyTransfer brand). */
const GOLD = "#C9A96E";

type Variant = "dark" | "light";

const PALETTE: Record<
  Variant,
  {
    overlay: string;
    panel: string;
    border: string;
    title: string;
    close: string;
    imgWrap: string;
    name: string;
    subtitle: string;
    benefit: string;
    footerBg: string;
    decline: string;
  }
> = {
  dark: {
    overlay: "bg-black/70",
    panel: "bg-[#0D0D0D]",
    border: "border-[rgba(255,255,255,0.12)]",
    title: "text-[#F7F4EF]",
    close: "text-[#999] hover:text-[#C9A96E]",
    imgWrap: "border-[rgba(255,255,255,0.08)] bg-[#1E1D1B]",
    name: "text-[#F7F4EF]",
    subtitle: "text-[#999]",
    benefit: "text-[#F7F4EF]",
    footerBg: "bg-[#0D0D0D]",
    decline:
      "border border-[rgba(255,255,255,0.18)] text-[#F7F4EF] hover:bg-[rgba(255,255,255,0.04)]",
  },
  light: {
    overlay: "bg-black/50",
    panel: "bg-white",
    border: "border-[rgba(0,0,0,0.08)]",
    title: "text-neutral-900",
    close: "text-neutral-400 hover:text-[#C9A96E]",
    imgWrap: "border-[rgba(0,0,0,0.08)] bg-neutral-100",
    name: "text-neutral-900",
    subtitle: "text-neutral-500",
    benefit: "text-neutral-800",
    footerBg: "bg-white",
    decline:
      "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
  },
};

interface ExperienceUpgradeModalProps {
  open: boolean;
  /** "Não, obrigado" — dismiss and continue with the standard vehicle. */
  onDecline: () => void;
  /** "Fazer upgrade" — switch to the premium vehicle and continue. */
  onAccept: () => void;
  /** Premium vehicle being offered. */
  vehicleName: string;
  vehicleImage: string;
  /** Extra (tax-inclusive, whole euros) over the selected standard vehicle. */
  priceDelta: number;
  /** Dark = main checkout (default); light = customizable / white-label. */
  variant?: Variant;
}

/**
 * Experience-upgrade upsell shown when the customer selected a standard vehicle
 * that an admin mapped to a premium one (`upgradeFromVehicleId`). Mirrors the
 * checkout modal style (see add-experience-modal). Shared by both the main (dark)
 * and the customizable / white-label (light) checkout stacks.
 */
export function ExperienceUpgradeModal({
  open,
  onDecline,
  onAccept,
  vehicleName,
  vehicleImage,
  priceDelta,
  variant = "dark",
}: ExperienceUpgradeModalProps) {
  const t = useTranslations("experienceUpgrade");
  if (!open) return null;

  const c = PALETTE[variant];
  const plus = `+€${priceDelta}`;
  const benefits = [
    t("benefit1"),
    t("benefit2"),
    t("benefit3"),
    t("benefit4"),
  ];

  return (
    <div
      className={`fixed inset-0 ${c.overlay} flex items-center justify-center p-4 z-50 animate-in fade-in duration-300`}
    >
      <div
        className={`${c.panel} border ${c.border} shadow-2xl max-w-[560px] w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 border-b ${c.border} shrink-0`}
        >
          <h2
            className={`text-[24px] font-semibold leading-none ${c.title}`}
            style={SERIF_FONT}
          >
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={onDecline}
            aria-label={t("decline")}
            className={`${c.close} transition-colors`}
          >
            <X className="w-6 h-6" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`relative w-[128px] h-[76px] shrink-0 overflow-hidden border ${c.imgWrap}`}
            >
              <Image
                src={vehicleImage || "/images/image-54.png"}
                alt={vehicleName}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-[18px] font-bold leading-tight ${c.name}`}>
                {vehicleName}
              </h3>
              <p className={`text-[13px] mt-1.5 leading-[1.5] ${c.subtitle}`}>
                {t("subtitle")}{" "}
                <span className="font-semibold" style={{ color: GOLD }}>
                  {plus}
                </span>
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-3 mb-6">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check
                  className="w-[18px] h-[18px] text-emerald-500 shrink-0"
                  strokeWidth={2.5}
                />
                <span className={`text-[14px] ${c.benefit}`}>{b}</span>
              </li>
            ))}
          </ul>

          <div
            className="flex items-center gap-2 border px-3 py-2"
            style={{ borderColor: "rgba(201,169,110,0.4)" }}
          >
            <Flame
              className="w-4 h-4 shrink-0"
              style={{ color: GOLD, fill: GOLD }}
            />
            <span
              className="text-[12px] font-medium"
              style={{ color: GOLD }}
            >
              {t("socialProof")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 pt-4 pb-5 ${c.footerBg} shrink-0 border-t ${c.border} flex gap-3`}
        >
          <button
            type="button"
            onClick={onDecline}
            className={`flex-1 h-12 ${c.decline} text-[13px] font-medium uppercase tracking-[1.1px] transition-colors`}
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex-[1.4] h-12 text-[#0D0D0D] text-[13px] font-medium uppercase tracking-[1.1px] inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD }}
          >
            {t("accept")} {plus}
          </button>
        </div>
      </div>
    </div>
  );
}
