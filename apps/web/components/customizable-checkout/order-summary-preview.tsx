"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Briefcase,
  ChevronDown,
  MapPin,
  CalendarClock,
  User,
  Car,
  MapPinCheckInside,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getDailyNumber } from "@/lib/daily-number";
import { useMarketingStats } from "@/hooks/use-marketing-stats";

const MOCK_DATA = {
  orderId: "ORD-12345",
  totalPrice: "€ 45,00",
  vehicle: {
    name: "Standard",
    image: "/fleet/standard-car.png",
    passengers: 3,
    luggage: 3,
  },
  from: "Lisbon Airport (LIS)",
  to: "Hotel Ritz Lisboa",
  date: "Mon, 15 Jan",
  time: "14:30",
  passengers: 2,
  luggage: 2,
  stops: 2,
};

export function OrderSummarySidebarPreview() {
  const t = useTranslations("orderSummary");
  const tCommon = useTranslations("common");
  const { checkoutBookedTodayMin, checkoutBookedTodayMax } =
    useMarketingStats();
  const [dailyBookedCount, setDailyBookedCount] = useState(() =>
    getDailyNumber(
      "checkout-booked",
      checkoutBookedTodayMin,
      checkoutBookedTodayMax,
    ),
  );

  useEffect(() => {
    const updateDailyBookedCount = () => {
      setDailyBookedCount(
        getDailyNumber(
          "checkout-booked",
          checkoutBookedTodayMin,
          checkoutBookedTodayMax,
        ),
      );
    };
    updateDailyBookedCount();
    const interval = setInterval(updateDailyBookedCount, 3600000);
    return () => clearInterval(interval);
  }, [checkoutBookedTodayMin, checkoutBookedTodayMax]);

  return (
    <div className="checkout-order-summary space-y-6">
      <div
        className="rounded-2xl shadow-sm p-6"
        style={{
          backgroundColor: "var(--theme-checkout-order-summary-bg, #FFFFFF)",
        }}
      >
        <div className="mb-6">
          <h2
            className="text-[20px] font-bold mb-1"
            style={{
              color: "var(--theme-checkout-order-summary-title, #222222)",
            }}
          >
            {t("title")}
          </h2>
          <p
            className="text-[13px]"
            style={{
              color: "var(--theme-checkout-order-summary-text, #222222)",
            }}
          >
            {t("orderNumber")}{" "}
            <span
              style={{
                color:
                  "var(--theme-checkout-order-summary-muted-text, #808080)",
              }}
            >
              {MOCK_DATA.orderId}
            </span>
          </p>
        </div>

        <div
          className="rounded-xl p-4 mb-3"
          style={{
            backgroundColor:
              "var(--theme-checkout-order-summary-total-bg, #F3F4F4)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[18px] font-bold"
              style={{
                color: "var(--theme-checkout-order-summary-title, #222222)",
              }}
            >
              {t("total")}
            </span>
            <span
              className="text-[32px] font-bold"
              style={{
                color:
                  "var(--theme-checkout-order-summary-total-price, #222222)",
              }}
            >
              {MOCK_DATA.totalPrice}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor:
                    "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
                }}
              >
                <CalendarClock
                  className="w-4 h-4"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                  }}
                />
                <p
                  className="text-[13px] font-semibold"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                  }}
                >
                  {MOCK_DATA.date}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--theme-checkout-order-summary-muted-text, #A0A0A0)",
                    }}
                  />
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-[2px] h-5"
                    style={{
                      backgroundColor:
                        "var(--theme-checkout-order-summary-muted-text, #A0A0A0)",
                    }}
                  />
                </div>
                <p
                  className="text-[13px] truncate"
                  style={{
                    color: "var(--theme-checkout-order-summary-text, #222222)",
                  }}
                >
                  {MOCK_DATA.from}
                </p>
              </div>
              <p
                className="text-[13px] font-semibold flex-shrink-0"
                style={{
                  color: "var(--theme-checkout-order-summary-text, #222222)",
                }}
              >
                {MOCK_DATA.time}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--theme-checkout-order-summary-muted-text, #A0A0A0)",
                    }}
                  />
                </div>
                <p
                  className="text-[13px] truncate"
                  style={{
                    color: "var(--theme-checkout-order-summary-text, #222222)",
                  }}
                >
                  {MOCK_DATA.to}
                </p>
              </div>
              <p
                className="text-[13px] font-semibold flex-shrink-0"
                style={{
                  color: "var(--theme-checkout-order-summary-text, #222222)",
                }}
              >
                —
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3
            className="text-[20px] font-bold mb-4"
            style={{
              color: "var(--theme-checkout-order-summary-title, #222222)",
            }}
          >
            {t("selectedCar")}
          </h3>

          <div className="flex items-start gap-4 mb-3">
            <div className="w-[180px] flex-shrink-0">
              <Image
                src={MOCK_DATA.vehicle.image}
                alt={MOCK_DATA.vehicle.name}
                width={180}
                height={110}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex flex-col items-end flex-1">
              <span
                className="text-[24px] font-bold"
                style={{
                  color: "var(--theme-checkout-order-summary-title, #222222)",
                }}
              >
                {MOCK_DATA.vehicle.name}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor:
                    "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
                }}
              >
                <Users
                  className="w-4 h-4"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                  }}
                />
                <span
                  className="text-[15px] font-semibold"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                  }}
                >
                  {MOCK_DATA.vehicle.passengers}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor:
                    "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
                }}
              >
                <Briefcase
                  className="w-4 h-4"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                  }}
                />
                <span
                  className="text-[15px] font-semibold"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                  }}
                >
                  {MOCK_DATA.vehicle.luggage}
                </span>
              </div>
            </div>
            <button
              className="font-bold text-[15px] h-11 px-8 rounded-lg"
              style={{
                backgroundColor:
                  "var(--theme-checkout-primary-button-bg, #27C7FF)",
                color: "var(--theme-checkout-primary-button-text, #FFFFFF)",
              }}
            >
              {tCommon("edit").toUpperCase()}
            </button>
          </div>
        </div>

        <div
          className="mb-6 pt-6"
          style={{
            borderTop:
              "1px solid var(--theme-checkout-order-summary-divider, #E0E0E0)",
          }}
        >
          <button className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h3
                className="text-[20px] font-bold"
                style={{
                  color: "var(--theme-checkout-order-summary-title, #222222)",
                }}
              >
                {t("itinerary")}
              </h3>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor:
                    "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
                }}
              >
                <MapPin
                  className="w-4 h-4"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                  }}
                />
                <span
                  className="text-[13px] font-semibold"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                  }}
                >
                  {MOCK_DATA.stops} {t("stops")}
                </span>
              </div>
            </div>
            <ChevronDown
              className="w-5 h-5"
              style={{
                color: "var(--theme-checkout-order-summary-title, #222222)",
              }}
            />
          </button>
        </div>

        <div
          className="mb-6 pt-6"
          style={{
            borderTop:
              "1px solid var(--theme-checkout-order-summary-divider, #E0E0E0)",
          }}
        >
          <button className="w-full flex items-center justify-between">
            <h3
              className="text-[20px] font-bold"
              style={{
                color: "var(--theme-checkout-order-summary-title, #222222)",
              }}
            >
              {t("invoice")}
            </h3>
            <ChevronDown
              className="w-5 h-5"
              style={{
                color: "var(--theme-checkout-order-summary-title, #222222)",
              }}
            />
          </button>
        </div>

        <div
          className="mb-4"
          style={{
            borderTop:
              "1px solid var(--theme-checkout-order-summary-divider, #E0E0E0)",
          }}
        />

        <div className="flex flex-col items-end gap-2 mb-4">
          <div
            className="text-[24px] font-bold"
            style={{
              color:
                "var(--theme-checkout-order-summary-accent-price, #27C7FF)",
            }}
          >
            {MOCK_DATA.totalPrice}
          </div>
          <div className="flex flex-col items-end gap-1 text-[14px]">
            <div
              style={{
                color: "var(--theme-checkout-order-summary-text, #222222)",
              }}
            >
              {t("totalPrice")}
            </div>
            <div
              style={{
                color:
                  "var(--theme-checkout-order-summary-muted-text, #808080)",
              }}
            >
              {t("taxesIncluded")}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-3 p-4 rounded-lg mb-4"
          style={{
            backgroundColor: "var(--theme-checkout-form-highlight-bg, #DFF7FF)",
          }}
        >
          <span className="text-xl">✓</span>
          <div>
            <p
              className="text-[14px] font-semibold"
              style={{
                color: "var(--theme-checkout-form-highlight-text, #0E4659)",
              }}
            >
              {t("freeCancellation")}
            </p>
            <p
              className="text-[12px]"
              style={{
                color: "var(--theme-checkout-form-highlight-text, #0E4659)",
              }}
            >
              {t("freeCancellationDesc")}
            </p>
          </div>
        </div>

        <div
          className="flex items-center justify-center gap-2 text-[12px]"
          style={{
            color: "var(--theme-checkout-order-summary-muted-text, #808080)",
          }}
        >
          <span className="text-lg">🔥</span>
          <span>{t("bookedToday", { count: dailyBookedCount })}</span>
        </div>
      </div>

      <div
        className="rounded-2xl shadow-sm p-6"
        style={{
          backgroundColor: "var(--theme-checkout-order-summary-bg, #FFFFFF)",
        }}
      >
        <h3
          className="text-[20px] font-bold mb-2"
          style={{
            color: "var(--theme-checkout-order-summary-title, #222222)",
          }}
        >
          {t("map")}
        </h3>
        <p
          className="text-[14px] mb-4"
          style={{
            color: "var(--theme-checkout-order-summary-muted-text, #808080)",
          }}
        >
          <span className="font-semibold">{t("route")}</span> Lisbon → Hotel
          Ritz
        </p>
        <div
          className="aspect-[4/3] rounded-lg"
          style={{
            backgroundColor:
              "var(--theme-checkout-order-summary-total-bg, #F3F4F4)",
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <MapPin
              className="w-12 h-12"
              style={{
                color:
                  "var(--theme-checkout-order-summary-muted-text, #808080)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderSummaryMobilePreview() {
  const t = useTranslations("orderSummary");

  return (
    <div className="checkout-order-summary lg:hidden w-full">
      <div
        className="rounded-[22px] shadow-sm overflow-hidden"
        style={{
          backgroundColor: "var(--theme-checkout-order-summary-bg, #FFFFFF)",
        }}
      >
        <div className="w-full px-6 pt-0 pb-4 text-left">
          <div className="flex justify-center py-2">
            <div
              className="w-[80px] h-[5px] rounded-full"
              style={{
                backgroundColor:
                  "var(--theme-checkout-order-summary-divider, #E0E0E0)",
              }}
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h2
                className="text-[18px] font-bold leading-tight"
                style={{
                  color: "var(--theme-checkout-order-summary-title, #222222)",
                }}
              >
                {t("title")}
              </h2>
              <div className="mt-1.5 flex flex-col">
                <span
                  className="text-[14px]"
                  style={{
                    color: "var(--theme-checkout-order-summary-text, #222222)",
                  }}
                >
                  {t("totalPrice")}
                </span>
                <span
                  className="text-[14px]"
                  style={{
                    color:
                      "var(--theme-checkout-order-summary-muted-text, #808080)",
                  }}
                >
                  {t("taxesIncluded")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="text-[36px] font-bold leading-none"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-total-price, #000000)",
                }}
              >
                {MOCK_DATA.totalPrice}
              </span>
              <ChevronDown
                className="w-6 h-6"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-accent-price, #27C7FF)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                backgroundColor:
                  "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
              }}
            >
              <User
                className="w-[18px] h-[18px]"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                }}
              />
              <span
                className="text-[15px] font-semibold"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                }}
              >
                {MOCK_DATA.passengers}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                backgroundColor:
                  "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
              }}
            >
              <Briefcase
                className="w-[18px] h-[18px]"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                }}
              />
              <span
                className="text-[15px] font-semibold"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                }}
              >
                {MOCK_DATA.luggage}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                backgroundColor:
                  "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
              }}
            >
              <Car
                className="w-[18px] h-[18px]"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                }}
              />
              <span
                className="text-[15px] font-semibold"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                }}
              >
                {MOCK_DATA.vehicle.name}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                backgroundColor:
                  "var(--theme-checkout-order-summary-badge-bg, #E9F9FF)",
              }}
            >
              <MapPinCheckInside
                className="w-[18px] h-[18px]"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-icon, #0E4659)",
                }}
              />
              <span
                className="text-[15px] font-semibold"
                style={{
                  color:
                    "var(--theme-checkout-order-summary-badge-text, #0E4659)",
                }}
              >
                {MOCK_DATA.stops} {t("stops")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
