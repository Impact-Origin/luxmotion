"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { Id } from "@workspace/convex/dataModel";
import {
  ArrowLeft,
  RotateCcw,
  Save,
  Monitor,
  Smartphone,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Layout,
  Square,
  MousePointer,
  Star,
  Car,
  CreditCard,
  HelpCircle,
  ShoppingCart,
  Home,
  Type,
  Palette,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";
import {
  defaultTheme,
  ThemeConfig,
  ThemeColors,
  DynamicThemeProvider,
} from "@/components/dynamic-theme-provider";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { useTranslations } from "next-intl";
import { ImageUpload } from "@/components/admin/image-upload";

const PRESET_COLORS = [
  "#27C7FF", // Blue (Original)
  "#0E4659", // Dark Teal
  "#00C569", // Green
  "#FF4B4B", // Red
  "#FBB03B", // Orange
  "#FFFFFF", // White
  "#1A1A1A", // Near Black
  "#4B5563", // Gray
  "#9CA3AF", // Light Gray
  "#E5E7EB", // Very Light Gray
  "#F3F4F6", // Off White
];

interface ColorSection {
  id: string;
  title: string;
  icon: React.ElementType;
  colors: { key: keyof ThemeColors; label: string }[];
}

const LANDING_COLOR_SECTIONS: ColorSection[] = [
  {
    id: "landingHeader",
    title: "landingHeader",
    icon: Layout,
    colors: [
      { key: "landingHeaderBg", label: "landingHeaderBg" },
      { key: "landingHeaderText", label: "landingHeaderText" },
      { key: "landingHeaderHoverText", label: "landingHeaderHoverText" },
      { key: "landingHeaderButtonBg", label: "landingHeaderButtonBg" },
      { key: "landingHeaderButtonText", label: "landingHeaderButtonText" },
      { key: "landingHeaderButtonIcon", label: "landingHeaderButtonIcon" },
      { key: "landingHeaderMenuIcon", label: "landingHeaderMenuIcon" },
      { key: "landingHeaderMenuBg", label: "landingHeaderMenuBg" },
      { key: "landingHeaderMenuBorder", label: "landingHeaderMenuBorder" },
      {
        key: "landingHeaderMenuItemHoverBg",
        label: "landingHeaderMenuItemHoverBg",
      },
    ],
  },
  {
    id: "hero",
    title: "heroSection",
    icon: Layout,
    colors: [
      { key: "heroBg", label: "heroBg" },
      { key: "heroTitle", label: "heroTitle" },
      { key: "heroSubtitle", label: "heroSubtitle" },
      { key: "heroBadgeBg", label: "heroBadgeBg" },
      { key: "heroBadgeText", label: "heroBadgeText" },
      { key: "heroBadgeIcon", label: "heroBadgeIcon" },
      { key: "heroBannerBg", label: "heroBannerBg" },
      { key: "heroBannerIcon", label: "heroBannerIcon" },
      { key: "heroBannerFlame", label: "heroBannerFlame" },
      { key: "heroBookingBg", label: "heroBookingBg" },
      { key: "heroBookingBorder", label: "heroBookingBorder" },
      { key: "heroBookingInputBg", label: "heroBookingInputBg" },
      { key: "heroBookingInputText", label: "heroBookingInputText" },
      { key: "heroBookingPlaceholder", label: "heroBookingPlaceholder" },
      { key: "heroBookingInputHoverBg", label: "heroBookingInputHoverBg" },
      { key: "heroBookingText", label: "heroBookingText" },
      { key: "heroBookingAccent", label: "heroBookingAccent" },
      { key: "heroBookingIcon", label: "heroBookingIcon" },
      { key: "heroTrustStarColor", label: "heroTrustStarColor" },
    ],
  },
  {
    id: "testimonials",
    title: "testimonialsSection",
    icon: Star,
    colors: [
      { key: "testimonialGradientStart", label: "testimonialGradientStart" },
      { key: "testimonialGradientEnd", label: "testimonialGradientEnd" },
      { key: "cardBg", label: "testimonialCardBg" },
      { key: "headingText", label: "testimonialName" },
      { key: "mutedText", label: "testimonialDate" },
      { key: "bodyText", label: "testimonialText" },
      { key: "primary", label: "testimonialStars" },
      { key: "buttonBg", label: "testimonialNavButtonBg" },
    ],
  },
  {
    id: "features",
    title: "featuresSection",
    icon: Square,
    colors: [
      { key: "background", label: "featuresSectionBg" },
      { key: "featuresSectionTitle", label: "featuresSectionTitle" },
      { key: "featureCardBg", label: "featureCardBackground" },
      { key: "featureCardTitle", label: "featureCardTitle" },
      { key: "featureCardDescription", label: "featureCardDescription" },
      { key: "iconColor", label: "featureIconColor" },
    ],
  },
  {
    id: "fleet",
    title: "fleetSection",
    icon: Car,
    colors: [
      { key: "background", label: "fleetSectionBg" },
      { key: "fleetSectionTitle", label: "fleetSectionTitle" },
      { key: "fleetVehicleCardBg", label: "vehicleCardBg" },
      { key: "fleetVehicleName", label: "vehicleName" },
      { key: "fleetCapacityBadgeBg", label: "capacityBadgeBg" },
      { key: "fleetCapacityBadgeText", label: "capacityBadgeText" },
      { key: "electricBadgeBg", label: "electricBadgeBackground" },
      { key: "electricBadgeText", label: "electricBadgeText" },
      { key: "fleetIconColor", label: "fleetIconColor" },
      { key: "buttonBg", label: "fleetButtonBg" },
    ],
  },
  {
    id: "payment",
    title: "paymentSection",
    icon: CreditCard,
    colors: [
      { key: "background", label: "paymentSectionBg" },
      { key: "paymentSectionTitle", label: "paymentSectionTitle" },
      { key: "exclusiveBadgeBg", label: "exclusiveBadgeBackground" },
      { key: "buttonText", label: "exclusiveBadgeText" },
      { key: "paymentExclusiveBadgeIcon", label: "exclusiveBadgeIcon" },
      { key: "secondary", label: "paymentDescription" },
      { key: "paymentSecurityBadgeBg", label: "securityBadgeBg" },
      { key: "paymentSecurityBadgeText", label: "securityBadgeText" },
      { key: "paymentIconColor", label: "paymentIconColor" },
    ],
  },
  {
    id: "faq",
    title: "faqSection",
    icon: HelpCircle,
    colors: [
      { key: "background", label: "faqSectionBg" },
      { key: "faqTitle", label: "faqTitle" },
      { key: "faqSubtitle", label: "faqSubtitle" },
      { key: "faqCardBg", label: "faqCardBg" },
      { key: "faqCardBorder", label: "faqCardBorder" },
      { key: "faqQuestionText", label: "faqQuestionText" },
      { key: "faqAnswerText", label: "faqAnswerText" },
      { key: "faqIconColor", label: "faqIconColor" },
    ],
  },
  {
    id: "whySchedule",
    title: "whyScheduleSection",
    icon: Square,
    colors: [
      { key: "whyScheduleBg", label: "whyScheduleBg" },
      { key: "whyScheduleTitle", label: "whyScheduleTitle" },
      { key: "whyScheduleStatsWrapperBg", label: "whyScheduleStatsWrapperBg" },
      { key: "whyScheduleStatsCardBg", label: "whyScheduleStatsCardBg" },
      { key: "whyScheduleStatsAccent", label: "whyScheduleStatsAccent" },
      { key: "whyScheduleStatsText", label: "whyScheduleStatsText" },
      { key: "whyScheduleFeatureCardBg", label: "whyScheduleFeatureCardBg" },
      { key: "whyScheduleFeatureIconBg", label: "whyScheduleFeatureIconBg" },
      { key: "whyScheduleFeatureIcon", label: "whyScheduleFeatureIcon" },
      { key: "whyScheduleFeatureText", label: "whyScheduleFeatureText" },
      { key: "whyScheduleResourcesTitle", label: "whyScheduleResourcesTitle" },
      {
        key: "whyScheduleResourcesIconBorder",
        label: "whyScheduleResourcesIconBorder",
      },
      { key: "whyScheduleResourcesIcon", label: "whyScheduleResourcesIcon" },
      { key: "whyScheduleResourcesText", label: "whyScheduleResourcesText" },
    ],
  },
  {
    id: "lisbonBanner",
    title: "lisbonBannerSection",
    icon: Layout,
    colors: [
      { key: "lisbonBannerBg", label: "lisbonBannerBg" },
      { key: "lisbonBannerTopFade", label: "lisbonBannerTopFade" },
      { key: "lisbonBannerBottomFade", label: "lisbonBannerBottomFade" },
    ],
  },
  {
    id: "whatsapp",
    title: "whatsAppSection",
    icon: Home,
    colors: [
      { key: "whatsappFloatBg", label: "whatsappFloatBg" },
      { key: "whatsappFloatIcon", label: "whatsappFloatIcon" },
    ],
  },
  {
    id: "footer",
    title: "footerSection",
    icon: Layout,
    colors: [
      { key: "footer", label: "footerBackground" },
      { key: "logoBg", label: "footerLogoBg" },
      { key: "logoText", label: "footerLogoText" },
      { key: "linkText", label: "footerLinkColor" },
    ],
  },
];

const CHECKOUT_COLOR_SECTIONS: ColorSection[] = [
  {
    id: "checkoutPage",
    title: "checkoutPage",
    icon: Layout,
    colors: [{ key: "checkoutPageBg", label: "checkoutPageBg" }],
  },
  {
    id: "checkoutHeader",
    title: "checkoutHeader",
    icon: Layout,
    colors: [
      { key: "checkoutHeaderBg", label: "checkoutHeaderBg" },
      { key: "checkoutStepActiveBg", label: "checkoutStepActiveBg" },
      { key: "checkoutStepActiveText", label: "checkoutStepActiveText" },
      { key: "checkoutStepInactiveBg", label: "checkoutStepInactiveBg" },
      { key: "checkoutStepInactiveText", label: "checkoutStepInactiveText" },
      {
        key: "checkoutStepConnectorActive",
        label: "checkoutStepConnectorActive",
      },
      {
        key: "checkoutStepConnectorInactive",
        label: "checkoutStepConnectorInactive",
      },
    ],
  },
  {
    id: "checkoutTrustBanner",
    title: "checkoutTrustBanner",
    icon: Star,
    colors: [
      { key: "checkoutTrustBannerBg", label: "checkoutTrustBannerBg" },
      { key: "checkoutTrustBannerIconBg", label: "checkoutTrustBannerIconBg" },
      { key: "checkoutTrustBannerIcon", label: "checkoutTrustBannerIcon" },
      { key: "checkoutTrustBannerTitle", label: "checkoutTrustBannerTitle" },
      {
        key: "checkoutTrustBannerDescription",
        label: "checkoutTrustBannerDescription",
      },
      {
        key: "checkoutTrustBannerDotActive",
        label: "checkoutTrustBannerDotActive",
      },
      {
        key: "checkoutTrustBannerDotInactive",
        label: "checkoutTrustBannerDotInactive",
      },
    ],
  },
  {
    id: "checkoutVehicleCard",
    title: "checkoutVehicleCard",
    icon: Car,
    colors: [
      { key: "checkoutVehicleCardBg", label: "checkoutVehicleCardBg" },
      { key: "checkoutVehicleCardBorder", label: "checkoutVehicleCardBorder" },
      { key: "checkoutVehicleCardTitle", label: "checkoutVehicleCardTitle" },
      { key: "checkoutVehicleCardPrice", label: "checkoutVehicleCardPrice" },
      {
        key: "checkoutVehicleCardPriceSubtext",
        label: "checkoutVehicleCardPriceSubtext",
      },
      {
        key: "checkoutVehicleCardBadgeBg",
        label: "checkoutVehicleCardBadgeBg",
      },
      {
        key: "checkoutVehicleCardBadgeText",
        label: "checkoutVehicleCardBadgeText",
      },
      {
        key: "checkoutVehicleCardBadgeIcon",
        label: "checkoutVehicleCardBadgeIcon",
      },
      {
        key: "checkoutVehicleElectricBadgeBg",
        label: "checkoutVehicleElectricBadgeBg",
      },
      {
        key: "checkoutVehicleElectricBadgeText",
        label: "checkoutVehicleElectricBadgeText",
      },
    ],
  },
  {
    id: "checkoutInputs",
    title: "checkoutInputs",
    icon: Type,
    colors: [
      { key: "checkoutInputBg", label: "checkoutInputBg" },
      { key: "checkoutInputBorder", label: "checkoutInputBorder" },
      { key: "checkoutInputText", label: "checkoutInputText" },
      { key: "checkoutInputPlaceholder", label: "checkoutInputPlaceholder" },
      { key: "checkoutInputIcon", label: "checkoutInputIcon" },
      { key: "checkoutInputLabelText", label: "checkoutInputLabelText" },
    ],
  },
  {
    id: "checkoutButtons",
    title: "checkoutButtons",
    icon: Palette,
    colors: [
      { key: "checkoutPrimaryButtonBg", label: "checkoutPrimaryButtonBg" },
      { key: "checkoutPrimaryButtonText", label: "checkoutPrimaryButtonText" },
      { key: "checkoutPrimaryButtonIcon", label: "checkoutPrimaryButtonIcon" },
      { key: "checkoutRadioSelectedFill", label: "checkoutRadioSelectedFill" },
    ],
  },
  {
    id: "checkoutOrderSummary",
    title: "checkoutOrderSummary",
    icon: ShoppingCart,
    colors: [
      { key: "checkoutOrderSummaryBg", label: "checkoutOrderSummaryBg" },
      { key: "checkoutOrderSummaryTitle", label: "checkoutOrderSummaryTitle" },
      { key: "checkoutOrderSummaryText", label: "checkoutOrderSummaryText" },
      {
        key: "checkoutOrderSummaryMutedText",
        label: "checkoutOrderSummaryMutedText",
      },
      {
        key: "checkoutOrderSummaryTotalBg",
        label: "checkoutOrderSummaryTotalBg",
      },
      {
        key: "checkoutOrderSummaryTotalPrice",
        label: "checkoutOrderSummaryTotalPrice",
      },
      {
        key: "checkoutOrderSummaryBadgeBg",
        label: "checkoutOrderSummaryBadgeBg",
      },
      {
        key: "checkoutOrderSummaryBadgeText",
        label: "checkoutOrderSummaryBadgeText",
      },
      {
        key: "checkoutOrderSummaryBadgeIcon",
        label: "checkoutOrderSummaryBadgeIcon",
      },
      {
        key: "checkoutOrderSummaryAccentPrice",
        label: "checkoutOrderSummaryAccentPrice",
      },
      {
        key: "checkoutOrderSummaryDivider",
        label: "checkoutOrderSummaryDivider",
      },
    ],
  },
  {
    id: "checkoutFormCard",
    title: "checkoutFormCard",
    icon: Square,
    colors: [
      { key: "checkoutFormCardBg", label: "checkoutFormCardBg" },
      { key: "checkoutFormCardTitle", label: "checkoutFormCardTitle" },
      {
        key: "checkoutExperiencesSectionTitle",
        label: "checkoutExperiencesSectionTitle",
      },
      {
        key: "checkoutExperiencesSectionSubtitle",
        label: "checkoutExperiencesSectionSubtitle",
      },
      { key: "checkoutFormLabelText", label: "checkoutFormLabelText" },
      { key: "checkoutFormTabActiveBg", label: "checkoutFormTabActiveBg" },
      { key: "checkoutFormTabActiveText", label: "checkoutFormTabActiveText" },
      { key: "checkoutFormTabInactiveBg", label: "checkoutFormTabInactiveBg" },
      {
        key: "checkoutFormTabInactiveText",
        label: "checkoutFormTabInactiveText",
      },
      { key: "checkoutFormInfoBoxBg", label: "checkoutFormInfoBoxBg" },
      { key: "checkoutFormInfoBoxText", label: "checkoutFormInfoBoxText" },
      { key: "checkoutFormInfoBoxIcon", label: "checkoutFormInfoBoxIcon" },
      { key: "checkoutFormHighlightBg", label: "checkoutFormHighlightBg" },
      { key: "checkoutFormHighlightText", label: "checkoutFormHighlightText" },
      { key: "checkoutFormCheckboxBg", label: "checkoutFormCheckboxBg" },
      { key: "checkoutFormLinkText", label: "checkoutFormLinkText" },
      { key: "checkoutFormErrorText", label: "checkoutFormErrorText" },
      { key: "checkoutFormSuccessText", label: "checkoutFormSuccessText" },
    ],
  },
  {
    id: "checkoutCounter",
    title: "checkoutCounter",
    icon: Type,
    colors: [
      { key: "checkoutCounterBg", label: "checkoutCounterBg" },
      { key: "checkoutCounterBorder", label: "checkoutCounterBorder" },
      { key: "checkoutCounterButtonBg", label: "checkoutCounterButtonBg" },
      { key: "checkoutCounterButtonIcon", label: "checkoutCounterButtonIcon" },
      { key: "checkoutCounterValueText", label: "checkoutCounterValueText" },
    ],
  },
  {
    id: "checkoutPaymentMethods",
    title: "checkoutPaymentMethods",
    icon: CreditCard,
    colors: [
      {
        key: "checkoutPaymentMethodSelectedBg",
        label: "checkoutPaymentMethodSelectedBg",
      },
      {
        key: "checkoutPaymentMethodSelectedBorder",
        label: "checkoutPaymentMethodSelectedBorder",
      },
      {
        key: "checkoutPaymentMethodUnselectedBg",
        label: "checkoutPaymentMethodUnselectedBg",
      },
      {
        key: "checkoutPaymentMethodUnselectedBorder",
        label: "checkoutPaymentMethodUnselectedBorder",
      },
      { key: "checkoutPaymentMethodIcon", label: "checkoutPaymentMethodIcon" },
      { key: "checkoutPaymentMethodText", label: "checkoutPaymentMethodText" },
    ],
  },
  {
    id: "checkoutInsurance",
    title: "checkoutInsurance",
    icon: ShieldCheck,
    colors: [
      { key: "checkoutInsuranceHeaderBg", label: "checkoutInsuranceHeaderBg" },
      { key: "checkoutInsuranceCheckBg", label: "checkoutInsuranceCheckBg" },
      {
        key: "checkoutInsuranceCheckIcon",
        label: "checkoutInsuranceCheckIcon",
      },
      {
        key: "checkoutInsuranceRecommendedBg",
        label: "checkoutInsuranceRecommendedBg",
      },
      {
        key: "checkoutInsuranceRecommendedText",
        label: "checkoutInsuranceRecommendedText",
      },
    ],
  },
  {
    id: "checkoutSecurityBanner",
    title: "checkoutSecurityBanner",
    icon: ShieldCheck,
    colors: [
      { key: "checkoutSecurityBannerBg", label: "checkoutSecurityBannerBg" },
      {
        key: "checkoutSecurityBannerBorder",
        label: "checkoutSecurityBannerBorder",
      },
      {
        key: "checkoutSecurityBannerIcon",
        label: "checkoutSecurityBannerIcon",
      },
      {
        key: "checkoutSecurityBannerTitle",
        label: "checkoutSecurityBannerTitle",
      },
      {
        key: "checkoutSecurityBannerText",
        label: "checkoutSecurityBannerText",
      },
    ],
  },
  {
    id: "checkoutLangSwitcher",
    title: "checkoutLangSwitcher",
    icon: Globe,
    colors: [
      { key: "checkoutLangSwitcherBg", label: "checkoutLangSwitcherBg" },
      {
        key: "checkoutLangSwitcherBorder",
        label: "checkoutLangSwitcherBorder",
      },
      { key: "checkoutLangSwitcherText", label: "checkoutLangSwitcherText" },
      {
        key: "checkoutLangSwitcherChevron",
        label: "checkoutLangSwitcherChevron",
      },
      {
        key: "checkoutLangSwitcherDropdownBg",
        label: "checkoutLangSwitcherDropdownBg",
      },
      {
        key: "checkoutLangSwitcherDropdownBorder",
        label: "checkoutLangSwitcherDropdownBorder",
      },
      {
        key: "checkoutLangSwitcherDropdownHoverBg",
        label: "checkoutLangSwitcherDropdownHoverBg",
      },
      {
        key: "checkoutLangSwitcherCheckIcon",
        label: "checkoutLangSwitcherCheckIcon",
      },
    ],
  },
  {
    id: "checkoutFooter",
    title: "checkoutFooter",
    icon: Layout,
    colors: [
      { key: "checkoutFooterBg", label: "checkoutFooterBg" },
      { key: "checkoutFooterHeadingText", label: "checkoutFooterHeadingText" },
      { key: "checkoutFooterLabelText", label: "checkoutFooterLabelText" },
      { key: "checkoutFooterLinkText", label: "checkoutFooterLinkText" },
      {
        key: "checkoutFooterCopyrightText",
        label: "checkoutFooterCopyrightText",
      },
      {
        key: "checkoutFooterSocialIconBg",
        label: "checkoutFooterSocialIconBg",
      },
      {
        key: "checkoutFooterSocialIconColor",
        label: "checkoutFooterSocialIconColor",
      },
    ],
  },
];

const ColorPicker = React.memo(function ColorPicker({
  label,
  value,
  colorKey,
  onColorChange,
  isSelected,
  id,
}: {
  label: string;
  value: string;
  colorKey: keyof ThemeColors;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  isSelected: boolean;
  id: string;
}) {
  const [localValue, setLocalValue] = React.useState(value);
  const rafRef = React.useRef<number | undefined>(undefined);
  const onColorChangeRef = React.useRef(onColorChange);
  onColorChangeRef.current = onColorChange;

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleChange = React.useCallback(
    (newValue: string) => {
      setLocalValue(newValue);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        onColorChangeRef.current(colorKey, newValue);
      });
    },
    [colorKey],
  );

  return (
    <div
      id={`color-${id}`}
      className={cn(
        "space-y-2 p-3 rounded-lg transition-all duration-200",
        isSelected
          ? "bg-blue-50 ring-2 ring-blue-400 shadow-sm"
          : "hover:bg-zinc-50",
      )}
    >
      <Label className="text-xs font-semibold text-zinc-600">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 rounded-lg border-2 border-zinc-200 shadow-sm shrink-0 cursor-pointer relative overflow-hidden"
          style={{ backgroundColor: localValue }}
        >
          <input
            type="color"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={localValue.toUpperCase()}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 font-mono text-sm text-zinc-900 uppercase border-zinc-200"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            className={cn(
              "h-5 w-5 rounded-full border border-zinc-200 transition-all hover:scale-110",
              localValue.toUpperCase() === color.toUpperCase()
                ? "ring-2 ring-blue-500 ring-offset-1 scale-110"
                : "",
            )}
            style={{ backgroundColor: color }}
            onClick={() => handleChange(color)}
          />
        ))}
      </div>
    </div>
  );
});

interface CollapsibleSectionProps {
  section: ColorSection;
  isExpanded: boolean;
  onToggle: (sectionId: string) => void;
  colors: ThemeColors;
  selectedColorType: string | null;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  t: (key: string) => string;
}

const CollapsibleSection = React.memo(
  function CollapsibleSection({
    section,
    isExpanded,
    onToggle,
    colors,
    selectedColorType,
    onColorChange,
    t,
  }: CollapsibleSectionProps) {
    const Icon = section.icon;
    const hasSelectedColor = section.colors.some(
      (c) => c.key === selectedColorType,
    );

    return (
      <div
        className={cn(
          "rounded-lg border transition-all",
          hasSelectedColor
            ? "border-blue-200 bg-blue-50/30"
            : "border-zinc-200",
        )}
      >
        <button
          onClick={() => onToggle(section.id)}
          className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon
              className={cn(
                "h-4 w-4",
                hasSelectedColor ? "text-blue-500" : "text-zinc-400",
              )}
            />
            <span className="text-sm font-semibold text-zinc-900">
              {t(section.title)}
            </span>
            {hasSelectedColor && (
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          )}
        </button>

        {isExpanded && (
          <div className="px-3 pb-3 space-y-2">
            {section.colors.map((color) => (
              <ColorPicker
                key={color.key}
                id={color.key}
                colorKey={color.key}
                label={t(color.label)}
                value={colors[color.key]}
                onColorChange={onColorChange}
                isSelected={selectedColorType === color.key}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
  (prev, next) => {
    if (prev.isExpanded !== next.isExpanded) return false;
    if (prev.selectedColorType !== next.selectedColorType) return false;
    if (prev.onColorChange !== next.onColorChange) return false;
    if (prev.onToggle !== next.onToggle) return false;
    if (!prev.isExpanded && !next.isExpanded) return true;
    for (const color of prev.section.colors) {
      if (prev.colors[color.key] !== next.colors[color.key]) return false;
    }
    return true;
  },
);

export default function PartnershipEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params) as { id: Id<"partnerships"> };
  const partnership = useQuery(api.partnerships.getById, { id });
  const updatePartnership = useMutation(api.partnerships.update);
  const t = useTranslations("admin");
  const tSeo = useTranslations("adminTours.form");

  const [activeTab, setActiveTab] = React.useState<"desktop" | "mobile">(
    "desktop",
  );
  const [pageType, setPageType] = React.useState<"landing" | "checkout">(
    "landing",
  );
  const [theme, setTheme] = React.useState<ThemeConfig>(defaultTheme);
  const [logoId, setLogoId] = React.useState<string | undefined>();
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [selectedColorType, setSelectedColorType] = React.useState<
    string | null
  >(null);
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "landingHeader",
    "hero",
  ]);
  const [customizationStep, setCustomizationStep] = React.useState(1);

  const colorSections =
    pageType === "landing" ? LANDING_COLOR_SECTIONS : CHECKOUT_COLOR_SECTIONS;

  const previewUrl =
    pageType === "landing" ? "/partnership-preview" : "/checkout-preview";

  const liveSiteUrl =
    pageType === "landing"
      ? `/${partnership?.slug}`
      : `/${partnership?.slug}/checkout`;

  React.useEffect(() => {
    if (partnership) {
      setTheme({
        ...defaultTheme,
        ...partnership.theme,
        colors: {
          ...defaultTheme.colors,
          ...(partnership.theme?.colors || {}),
        },
      });
      setLogoId(partnership.logoId);
      setLogoUrl(partnership.logoUrl);
      setSeoTitle(partnership.content?.seoTitle || "");
      setSeoDescription(partnership.content?.seoDescription || "");
    }
  }, [partnership]);

  React.useEffect(() => {
    if (pageType === "landing") {
      setExpandedSections(["landingHeader", "hero"]);
    } else {
      setExpandedSections(["checkoutHeader", "checkoutTrustBanner"]);
      setCustomizationStep(1);
    }
    setSelectedColorType(null);
  }, [pageType]);

  React.useEffect(() => {
    if (iframeRef.current?.contentWindow && pageType === "checkout") {
      iframeRef.current.contentWindow.postMessage(
        { type: "SET_CUSTOMIZATION_STEP", step: customizationStep },
        "*",
      );
    }
  }, [customizationStep, pageType]);

  const themeRef = React.useRef(theme);
  themeRef.current = theme;
  const logoUrlRef = React.useRef(logoUrl);
  logoUrlRef.current = logoUrl;
  const previewTimeoutRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const updatePreview = React.useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "UPDATE_THEME",
          theme: themeRef.current,
          logoUrl: logoUrlRef.current,
        },
        "*",
      );
    }
  }, []);

  React.useEffect(() => {
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = setTimeout(updatePreview, 30);
    return () => {
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
    };
  }, [theme, logoUrl, updatePreview]);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "THEME_ELEMENT_CLICKED") {
        const colorType = event.data.colorType;
        setSelectedColorType(colorType);

        const section = colorSections.find((s) =>
          s.colors.some((c) => c.key === colorType),
        );
        if (section && !expandedSections.includes(section.id)) {
          setExpandedSections((prev) => [...prev, section.id]);
        }

        setTimeout(() => {
          const element = document.getElementById(`color-${colorType}`);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
      if (event.data.type === "PREVIEW_READY") {
        updatePreview();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [expandedSections, colorSections, updatePreview]);

  const handleColorChange = React.useCallback(
    (key: keyof ThemeColors, value: string) => {
      setTheme((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          [key]: value,
        },
      }));
    },
    [],
  );

  const toggleSection = React.useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  }, []);

  const onSave = async () => {
    if (!partnership) return;
    try {
      setIsSaving(true);
      const nextContent = {
        ...(partnership.content || {}),
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
      } as Record<string, unknown>;

      if (!nextContent.seoTitle) delete nextContent.seoTitle;
      if (!nextContent.seoDescription) delete nextContent.seoDescription;

      await updatePartnership({
        id: partnership._id,
        name: partnership.name,
        slug: partnership.slug,
        theme,
        logoId: logoId as any,
        content: nextContent,
        status: partnership.status || "active",
      });
      toast.success(t("settingsSaved"));
    } catch (error) {
      toast.error(t("settingsSaveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm(t("confirmReset"))) {
      setTheme(defaultTheme);
    }
  };

  if (!partnership) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 bg-zinc-100 flex flex-col overflow-hidden z-30">
      <div className="h-14 bg-white border-b px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/partnerships">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              {partnership.name}
            </h2>
            <p className="text-xs text-zinc-500">/{partnership.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Page Type Toggle */}
          <Tabs value={pageType} onValueChange={(v: any) => setPageType(v)}>
            <TabsList className="bg-zinc-100/50 border h-9 p-1 gap-1">
              <TabsTrigger
                value="landing"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm h-7 px-3 gap-1.5 transition-all duration-200"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Landing</span>
              </TabsTrigger>
              <TabsTrigger
                value="checkout"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm h-7 px-3 gap-1.5 transition-all duration-200"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Checkout</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="h-9 gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("resetDefaults")}
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="h-9 bg-zinc-900 text-white hover:bg-zinc-800 gap-2 px-6"
          >
            <Save className="h-4 w-4" />
            {t("saveChanges")}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[340px] bg-white border-r flex flex-col shrink-0">
          <div className="p-4 border-b bg-zinc-50">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <MousePointer className="h-4 w-4 text-blue-500" />
              {t("clickToEdit")}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {t("clickToEditDescription")}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {pageType === "landing" && (
              <div className="space-y-2 mb-6">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Company Logo
                </Label>
                <ImageUpload
                  value={logoUrl}
                  onChange={(id) => {
                    setLogoId(id);
                    if (!id) setLogoUrl(null);
                  }}
                  disabled={isSaving}
                />

                <div className="pt-4 space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {tSeo("seoLabel")}
                  </Label>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-zinc-600">
                      {tSeo("seoTitleLabel")}
                    </Label>
                    <Input
                      value={seoTitle}
                      onChange={(event) => setSeoTitle(event.target.value)}
                      placeholder={tSeo("seoTitlePlaceholder")}
                      maxLength={70}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-zinc-600">
                      {tSeo("seoDescriptionLabel")}
                    </Label>
                    <Textarea
                      value={seoDescription}
                      onChange={(event) =>
                        setSeoDescription(event.target.value)
                      }
                      placeholder={tSeo("seoDescriptionPlaceholder")}
                      maxLength={180}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {colorSections.map((section) => (
              <CollapsibleSection
                key={section.id}
                section={section}
                isExpanded={expandedSections.includes(section.id)}
                onToggle={toggleSection}
                colors={theme.colors}
                selectedColorType={selectedColorType}
                onColorChange={handleColorChange}
                t={t}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {t("livePreview")}
              </span>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400 ml-2">
                {pageType === "landing" ? "Landing Page" : "Checkout Flow"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Tabs
                value={activeTab}
                onValueChange={(v: any) => setActiveTab(v)}
              >
                <TabsList className="bg-zinc-100/50 border h-10 p-1 gap-1">
                  <TabsTrigger
                    value="desktop"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm h-8 w-10 p-0 transition-all duration-200"
                  >
                    <Monitor className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="mobile"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm h-8 w-10 p-0 transition-all duration-200"
                  >
                    <Smartphone className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                variant="outline"
                size="icon"
                onClick={updatePreview}
                className="h-10 w-10 bg-white hover:bg-zinc-50 border transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Link href={liveSiteUrl} target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 bg-white hover:bg-zinc-50 border gap-2 px-4 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 text-zinc-500" />
                  <span className="font-medium text-zinc-700">
                    {t("viewLiveSite")}
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Checkout Customization Step Navigation */}
          {pageType === "checkout" && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mr-2">
                {t("customizationStep")}:
              </span>
              <button
                onClick={() => setCustomizationStep(1)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  customizationStep === 1
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                )}
              >
                {t("vehicleSelection")}
              </button>
              <button
                onClick={() => setCustomizationStep(2)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  customizationStep === 2
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                )}
              >
                {t("transferInfoForm")}
              </button>
              <button
                onClick={() => setCustomizationStep(3)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  customizationStep === 3
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                )}
              >
                {t("toursStep")}
              </button>
              <button
                onClick={() => setCustomizationStep(4)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  customizationStep === 4
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                )}
              >
                {t("passengerInfo")}
              </button>
              <button
                onClick={() => setCustomizationStep(5)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  customizationStep === 5
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                )}
              >
                {t("paymentStep")}
              </button>
            </div>
          )}

          <div className="flex-1 relative flex items-center justify-center">
            <div
              className={cn(
                "bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-hidden",
                activeTab === "desktop"
                  ? "w-full h-full rounded-lg border border-zinc-200"
                  : "w-[375px] h-[812px] rounded-[3rem] border-[12px] border-zinc-900",
              )}
            >
              <DynamicThemeProvider
                theme={theme}
                logoUrl={logoUrl}
                isPreviewMode={false}
              >
                <iframe
                  ref={iframeRef}
                  key={previewUrl}
                  src={previewUrl}
                  className="w-full h-full border-none"
                  title="Site Preview"
                />
              </DynamicThemeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
