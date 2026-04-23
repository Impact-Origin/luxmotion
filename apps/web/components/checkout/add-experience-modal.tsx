"use client";

import * as React from "react";
import Image from "next/image";
import { X, Plus, Minus, Flame, User, Baby, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { getDailyNumber } from "@/lib/daily-number";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { TourDateTimePicker } from "@/components/tours/tour-date-time-picker";
import { useTourAvailability } from "@/hooks/use-tour-data";
import { cn } from "@workspace/ui/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { Experience, ExperienceExtra } from "./shared";

export type { Experience, ExperienceExtra };

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const;

interface GuestRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
  minCount?: number;
}

function GuestRow({
  icon,
  label,
  description,
  count,
  onDecrement,
  onIncrement,
  minCount = 0,
}: GuestRowProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2.5 items-start">
        <div className="size-5 text-[#C9A96E] shrink-0">{icon}</div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-[#F7F4EF] leading-[19.2px]">
            {label}
          </span>
          <span className="text-[12px] font-medium text-[rgba(247,244,239,0.38)] uppercase tracking-[0.1px] leading-[14.85px]">
            {description}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= minCount}
          className="w-8 h-8 flex items-center justify-center border-[1.5px] border-[rgba(255,255,255,0.12)] text-[#F7F4EF] hover:bg-[rgba(255,255,255,0.04)] disabled:text-[rgba(247,244,239,0.35)] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
        <div className="w-10 h-8 flex items-center justify-center border-y-[1.5px] border-[rgba(255,255,255,0.12)]">
          <span
            className={cn(
              "text-[14px] font-medium tabular-nums",
              count > 0 ? "text-white" : "text-[#696969]",
            )}
          >
            {count}
          </span>
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="w-8 h-8 flex items-center justify-center border-[1.5px] border-[rgba(255,255,255,0.12)] text-[#F7F4EF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience;
  tourId: string | null;
  onAdd: (data: {
    passengers: number;
    date: Date | undefined;
    time: string | null;
    selectedExtras: string[];
    specialRequest: string;
    totalPrice: number;
  }) => void;
}

export function AddExperienceModal({
  isOpen,
  onClose,
  experience,
  tourId,
  onAdd,
}: AddExperienceModalProps) {
  const t = useTranslations("addExperience");
  const tTour = useTranslations("tourDetails");
  const isMobile = useIsMobile();
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [infants, setInfants] = React.useState(0);
  const [dateTime, setDateTime] = React.useState<{
    date: Date | null;
    time: string | null;
  }>({ date: null, time: null });
  const [selectedExtras, setSelectedExtras] = React.useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const now = new Date();
  const [dateRange, setDateRange] = React.useState({
    start: Date.UTC(now.getFullYear(), now.getMonth(), 1),
    end: Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  });

  const {
    availability,
    bookingDeadlineHours,
    isLoading: availabilityLoading,
  } = useTourAvailability(tourId, dateRange.start, dateRange.end);

  const handleMonthChange = React.useCallback(
    (startDate: number, endDate: number) => {
      setDateRange({ start: startDate, end: endDate });
    },
    [],
  );

  React.useEffect(() => {
    if (isOpen) {
      setAdults(1);
      setChildren(0);
      setInfants(0);
      setDateTime({ date: null, time: null });
      setSelectedExtras([]);
      if (isMobile) {
        requestAnimationFrame(() => setDrawerOpen(true));
      }
    }
  }, [isOpen, experience, isMobile]);

  React.useEffect(() => {
    if (!isOpen) {
      setDrawerOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId],
    );
  };

  const totalGuests = adults + children + infants;

  const calculateTotal = () => {
    const extrasTotal = experience.extras
      .filter((extra) => selectedExtras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0);
    return experience.basePrice * (totalGuests || 1) + extrasTotal;
  };

  const handleAdd = () => {
    onAdd({
      passengers: totalGuests,
      date: dateTime.date ?? undefined,
      time: dateTime.time,
      selectedExtras,
      specialRequest: "",
      totalPrice: calculateTotal(),
    });
  };

  const formatPrice = (price: number) => `€ ${price.toFixed(2)}`;

  const extras = experience.extras;

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(onClose, 250);
  };

  const modalProps = {
    experience,
    adults,
    children,
    infants,
    dateTime,
    selectedExtras,
    setAdults,
    setChildren,
    setInfants,
    handleExtraToggle,
    setDateTime,
    calculateTotal,
    t,
    tTour,
    extras,
    formatPrice,
    handleAdd,
    availability,
    bookingDeadlineHours,
    availabilityLoading,
    onMonthChange: handleMonthChange,
  };

  if (isMobile) {
    return (
      <div className="checkout-dark fixed inset-0 z-50 flex items-end justify-center">
        <div
          className={cn(
            "absolute inset-0 bg-black/80 transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={handleCloseDrawer}
        />
        <div
          className={cn(
            "relative w-full max-w-full bg-[#0D0D0D] border-t border-x border-[rgba(255,255,255,0.12)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-transform duration-300",
            drawerOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div
            className="mx-auto mt-2 mb-1 h-1 w-12 bg-[rgba(255,255,255,0.2)]"
            aria-hidden="true"
          />
          <ModalContent {...modalProps} onClose={handleCloseDrawer} />
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-dark fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-[#0D0D0D] border border-[rgba(255,255,255,0.12)] shadow-2xl max-w-[600px] w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <ModalContent {...modalProps} onClose={onClose} />
      </div>
    </div>
  );
}

interface ModalContentProps {
  experience: Experience;
  adults: number;
  children: number;
  infants: number;
  dateTime: { date: Date | null; time: string | null };
  selectedExtras: string[];
  onClose: () => void;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setInfants: (n: number) => void;
  handleExtraToggle: (id: string) => void;
  setDateTime: (d: { date: Date | null; time: string | null }) => void;
  calculateTotal: () => number;
  t: ReturnType<typeof useTranslations>;
  tTour: ReturnType<typeof useTranslations>;
  extras: ExperienceExtra[];
  formatPrice: (price: number) => string;
  handleAdd: () => void;
  availability: Array<{
    date: number;
    timeSlots: Array<{ startTime: string; endTime?: string }>;
    isCancelled: boolean;
    isRescheduled: boolean;
    isSpecial: boolean;
    reason?: string;
  }>;
  bookingDeadlineHours?: number;
  availabilityLoading: boolean;
  onMonthChange: (startDate: number, endDate: number) => void;
}

function ModalContent({
  experience,
  adults,
  children,
  infants,
  dateTime,
  selectedExtras,
  onClose,
  setAdults,
  setChildren,
  setInfants,
  handleExtraToggle,
  setDateTime,
  calculateTotal,
  t,
  tTour,
  extras,
  formatPrice,
  handleAdd,
  availability,
  bookingDeadlineHours,
  availabilityLoading,
  onMonthChange,
}: ModalContentProps) {
  const { checkoutBookedTodayMin, checkoutBookedTodayMax } =
    useMarketingStats();
  const dailyBookedCount = React.useMemo(
    () =>
      getDailyNumber(
        "checkout-booked-experience",
        checkoutBookedTodayMin,
        checkoutBookedTodayMax,
      ),
    [checkoutBookedTodayMin, checkoutBookedTodayMax],
  );

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.12)] shrink-0">
        <h2
          className="text-[24px] font-semibold leading-none text-[#F7F4EF]"
          style={SERIF_FONT}
        >
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-[#999] hover:text-[#C9A96E] transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={1.75} />
        </button>
      </div>

      <div className="px-6 py-6 overflow-y-auto flex-1">
        <div className="flex gap-4 mb-6">
          <div className="relative w-[200px] h-[140px] shrink-0 overflow-hidden border border-[rgba(255,255,255,0.08)]">
            <Image
              src={experience.image || "/placeholder-experience.png"}
              alt={experience.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[18px] font-bold text-[#F7F4EF] mb-2 leading-tight">
              {experience.title}
            </h3>
            <p className="text-[13px] text-[#999] leading-[1.5] line-clamp-4">
              {experience.description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="size-5 text-[#C9A96E]" strokeWidth={1.75} />
            <span className="text-[14px] font-bold text-[#F7F4EF]">
              {t("date")}
            </span>
          </div>
          <TourDateTimePicker
            value={dateTime}
            onChange={setDateTime}
            availability={availability}
            bookingDeadlineHours={bookingDeadlineHours}
            isLoading={availabilityLoading}
            onMonthChange={onMonthChange}
          />
        </div>

        <div className="bg-[#1E1D1B] border border-[rgba(255,255,255,0.08)] p-5 flex flex-col gap-4 mb-6">
          <GuestRow
            icon={<User className="size-5" strokeWidth={1.75} />}
            label={tTour("adult")}
            description={tTour("adultAge")}
            count={adults}
            onDecrement={() => setAdults(Math.max(1, adults - 1))}
            onIncrement={() => setAdults(adults + 1)}
            minCount={1}
          />
          <GuestRow
            icon={<User className="size-5" strokeWidth={1.75} />}
            label={tTour("children")}
            description={tTour("childrenAge")}
            count={children}
            onDecrement={() => setChildren(Math.max(0, children - 1))}
            onIncrement={() => setChildren(children + 1)}
          />
          <GuestRow
            icon={<Baby className="size-5" strokeWidth={1.75} />}
            label={tTour("infant")}
            description={tTour("infantAge")}
            count={infants}
            onDecrement={() => setInfants(Math.max(0, infants - 1))}
            onIncrement={() => setInfants(infants + 1)}
          />
        </div>

        {extras.length > 0 && (
          <div className="mb-2">
            <label className="block text-[12px] font-bold text-[#999] uppercase tracking-[1.152px] mb-3">
              {t("extras")}
            </label>
            <div className="flex flex-col gap-3">
              {extras.map((extra) => (
                <div key={extra.id} className="flex items-center gap-3">
                  <Checkbox
                    id={extra.id}
                    checked={selectedExtras.includes(extra.id)}
                    onCheckedChange={() => handleExtraToggle(extra.id)}
                  />
                  <label
                    htmlFor={extra.id}
                    className="text-[14px] text-[#F7F4EF] cursor-pointer select-none flex-1 truncate"
                  >
                    {extra.label}
                  </label>
                  <span className="text-[14px] font-semibold text-[#F7F4EF] shrink-0">
                    + € {extra.price}
                    {extra.pricingType && (
                      <span className="text-[11px] font-normal text-[#999] ml-1">
                        /
                        {extra.pricingType === "per_person"
                          ? tTour("perPerson")
                          : tTour("flatFee")}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pt-4 pb-5 bg-[#0D0D0D] shrink-0 border-t border-[rgba(255,255,255,0.12)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 border border-[rgba(201,169,110,0.4)] px-3 py-1.5">
            <Flame className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
            <span className="text-[12px] font-medium text-[#C9A96E]">
              {t("bookedTimes", { count: dailyBookedCount })}
            </span>
          </div>
          <div className="text-right">
            <div
              className="text-[24px] font-bold leading-none text-[#C9A96E]"
              style={SERIF_FONT}
            >
              {formatPrice(calculateTotal())}
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[1.152px] text-[#999] mt-1">
              {t("total")}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!dateTime.time}
          className="w-full h-12 bg-[#C9A96E] hover:bg-[#b89558] text-[#0D0D0D] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span className="px-1">{t("add")}</span>
        </button>
      </div>
    </>
  );
}
