"use client";

import * as React from "react";
import Image from "next/image";
import { X, Plus, Minus, Flame, User, Baby, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { getDailyNumber } from "@/lib/daily-number";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { TourDateTimePicker } from "@/components/tours/tour-date-time-picker";
import { useTourAvailability } from "@/hooks/use-tour-data";
import { cn } from "@workspace/ui/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { Experience, ExperienceExtra } from "./shared";

export type { Experience, ExperienceExtra };

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
      <div className="flex gap-[10px] items-start">
        <div
          data-theme-color="checkoutInputIcon"
          className="size-5"
          style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span
            data-theme-color="checkoutFormLabelText"
            className="text-[16px] font-semibold leading-[23px]"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {label}
          </span>
          <span
            data-theme-color="checkoutOrderSummaryMutedText"
            className="text-[14px] leading-[20px]"
            style={{
              color: "var(--theme-checkout-order-summary-muted-text, #808080)",
            }}
          >
            {description}
          </span>
        </div>
      </div>
      <div className="checkout-counter flex items-center gap-4">
        <button
          data-theme-color="checkoutCounterButtonBg"
          onClick={onDecrement}
          disabled={count <= minCount}
          className="size-[31px] rounded-full border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
            borderColor: "var(--theme-checkout-counter-border, #DEDEDE)",
            color: "var(--theme-checkout-counter-button-icon, #FFFFFF)",
          }}
        >
          <Minus
            data-theme-color="checkoutCounterButtonIcon"
            className="size-4"
            style={{
              color: "var(--theme-checkout-counter-button-icon, #FFFFFF)",
            }}
          />
        </button>
        <span
          data-theme-color="checkoutCounterValueText"
          className="text-[18px] font-semibold w-4 text-center"
          style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
        >
          {count}
        </span>
        <button
          data-theme-color="checkoutCounterButtonBg"
          onClick={onIncrement}
          className="size-[31px] rounded-full border flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
            borderColor: "var(--theme-checkout-counter-border, #DEDEDE)",
            color: "var(--theme-checkout-counter-button-icon, #FFFFFF)",
          }}
        >
          <Plus
            data-theme-color="checkoutCounterButtonIcon"
            className="size-4"
            style={{
              color: "var(--theme-checkout-counter-button-icon, #FFFFFF)",
            }}
          />
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

  const formatPrice = (price: number) => `EUR ${price.toFixed(2)}`;

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
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div
          className={cn(
            "absolute inset-0 bg-black/80 transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={handleCloseDrawer}
        />
        <div
          className={cn(
            "relative w-full max-w-full rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-transform duration-300",
            drawerOpen ? "translate-y-0" : "translate-y-full",
          )}
          style={{
            backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
          }}
        >
          <div className="flex flex-col">
            <div
              className="mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-gray-300"
              aria-hidden="true"
            />
          </div>
          <ModalContent {...modalProps} onClose={handleCloseDrawer} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div
        className="rounded-2xl shadow-xl max-w-[600px] w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        style={{
          backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
        }}
      >
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
      <div
        className="flex items-center justify-between px-4 py-4 border-b shrink-0"
        style={{ borderColor: "var(--theme-checkout-input-border, #E0E0E0)" }}
      >
        <h2
          data-theme-color="checkoutFormCardTitle"
          className="text-[22px] font-bold"
          style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
        >
          {t("title")}
        </h2>
        <button
          data-theme-color="checkoutInputIcon"
          onClick={onClose}
          className="transition-colors"
          style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
        >
          <X
            data-theme-color="checkoutInputIcon"
            className="w-6 h-6"
            style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
          />
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        <div className="flex gap-4 mb-6">
          <div className="relative w-[200px] h-[140px] shrink-0 rounded-lg overflow-hidden">
            <Image
              src={experience.image || "/placeholder-experience.png"}
              alt={experience.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3
              data-theme-color="checkoutFormCardTitle"
              className="text-[22px] font-bold mb-2 leading-tight"
              style={{
                color: "var(--theme-checkout-form-card-title, #222222)",
              }}
            >
              {experience.title}
            </h3>
            <p
              data-theme-color="checkoutOrderSummaryMutedText"
              className="text-sm line-clamp-4"
              style={{
                color:
                  "var(--theme-checkout-order-summary-muted-text, #808080)",
              }}
            >
              {experience.description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-1 mb-3">
            <CalendarDays
              data-theme-color="checkoutInputIcon"
              className="size-5"
              style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
            />
            <span
              data-theme-color="checkoutFormLabelText"
              className="text-[16px] font-semibold"
              style={{
                color: "var(--theme-checkout-form-label-text, #222222)",
              }}
            >
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

        <div
          data-theme-color="checkoutFormCheckboxBg"
          className="rounded-[16px] p-4 flex flex-col gap-4 mb-6"
          style={{
            backgroundColor: "var(--theme-checkout-form-checkbox-bg, #F7F7F7)",
          }}
        >
          <GuestRow
            icon={<User className="size-5" />}
            label={tTour("adult")}
            description={tTour("adultAge")}
            count={adults}
            onDecrement={() => setAdults(Math.max(1, adults - 1))}
            onIncrement={() => setAdults(adults + 1)}
            minCount={1}
          />
          <GuestRow
            icon={<User className="size-5" />}
            label={tTour("children")}
            description={tTour("childrenAge")}
            count={children}
            onDecrement={() => setChildren(Math.max(0, children - 1))}
            onIncrement={() => setChildren(children + 1)}
          />
          <GuestRow
            icon={<Baby className="size-5" />}
            label={tTour("infant")}
            description={tTour("infantAge")}
            count={infants}
            onDecrement={() => setInfants(Math.max(0, infants - 1))}
            onIncrement={() => setInfants(infants + 1)}
          />
        </div>

        {extras.length > 0 && (
          <div className="mb-4">
            <label
              data-theme-color="checkoutFormLabelText"
              className="block text-[15px] font-bold mb-2"
              style={{
                color: "var(--theme-checkout-form-label-text, #222222)",
              }}
            >
              {t("extras")}
            </label>
            <div className="space-y-3">
              {extras.map((extra) => (
                <div key={extra.id} className="flex items-center gap-3">
                  <Checkbox
                    id={extra.id}
                    checked={selectedExtras.includes(extra.id)}
                    onCheckedChange={() => handleExtraToggle(extra.id)}
                  />
                  <label
                    data-theme-color="checkoutFormLabelText"
                    htmlFor={extra.id}
                    className="text-[15px] cursor-pointer select-none flex-1 truncate"
                    style={{
                      color: "var(--theme-checkout-form-label-text, #222222)",
                    }}
                  >
                    {extra.label}
                  </label>
                  <span
                    data-theme-color="checkoutFormLabelText"
                    className="text-[15px] font-semibold shrink-0"
                    style={{
                      color: "var(--theme-checkout-form-label-text, #222222)",
                    }}
                  >
                    + EUR {extra.price}
                    {extra.pricingType && (
                      <span
                        data-theme-color="checkoutOrderSummaryMutedText"
                        className="text-[12px] font-normal ml-1"
                        style={{
                          color:
                            "var(--theme-checkout-order-summary-muted-text, #808080)",
                        }}
                      >
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

      <div
        data-theme-color="checkoutFormCardBg"
        className="p-4 pt-2 shrink-0 border-t"
        style={{
          backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
          borderColor: "var(--theme-checkout-order-summary-divider, #E0E0E0)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            data-theme-color="checkoutFormHighlightBg"
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              backgroundColor:
                "var(--theme-checkout-form-highlight-bg, #F7F7F7)",
            }}
          >
            <Flame
              data-theme-color="checkoutFormInfoBoxIcon"
              className="w-5 h-5"
              style={{
                color: "var(--theme-checkout-form-info-box-icon, #27C7FF)",
              }}
            />
            <span
              data-theme-color="checkoutFormHighlightText"
              className="text-[13px] font-medium"
              style={{
                color: "var(--theme-checkout-form-highlight-text, #808080)",
              }}
            >
              {t("bookedTimes", { count: dailyBookedCount })}
            </span>
          </div>
          <div className="text-right">
            <div
              data-theme-color="checkoutOrderSummaryTotalPrice"
              className="text-[24px] font-bold"
              style={{
                color:
                  "var(--theme-checkout-order-summary-total-price, #222222)",
              }}
            >
              {formatPrice(calculateTotal())}
            </div>
            <div
              data-theme-color="checkoutOrderSummaryMutedText"
              className="text-[14px]"
              style={{
                color:
                  "var(--theme-checkout-order-summary-muted-text, #808080)",
              }}
            >
              {t("total")}
            </div>
          </div>
        </div>

        <Button
          data-theme-color="checkoutPrimaryButtonBg"
          onClick={handleAdd}
          disabled={!dateTime.time}
          className="checkout-primary-button w-full h-12 font-bold text-[17px] uppercase rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
            color: "var(--theme-checkout-primary-button-text, #FFFFFF)",
          }}
        >
          <Plus
            data-theme-color="checkoutPrimaryButtonIcon"
            className="w-5 h-5 mr-2"
            strokeWidth={3}
            style={{
              color: "var(--theme-checkout-primary-button-icon, #FFFFFF)",
            }}
          />
          <span
            data-theme-color="checkoutPrimaryButtonText"
            style={{
              color: "var(--theme-checkout-primary-button-text, #FFFFFF)",
            }}
          >
            {t("add")}
          </span>
        </Button>
      </div>
    </>
  );
}
