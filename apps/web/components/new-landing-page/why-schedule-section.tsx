"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import {
    Car,
    Users,
    Leaf,
    MapPin,
    Award,
    Infinity,
    CreditCard,
    CheckCircle,
    Star,
    Handshake, HeartHandshake, User, CalendarClock, Settings2, TicketX, MapPinned, UserStar
} from "lucide-react"

export function WhyScheduleSection() {
  const t = useTranslations("whySchedule")

  return (
    <section id="services" className="bg-white py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#222] mb-8 md:mb-12">
            {t("title")}
          </h2>
          
          <div className="relative w-full max-w-[95%] md:max-w-[75%] mx-auto">
            <Image
              src="/why_schedule_thumbnail_container.png"
              alt={t("heroImageAlt")}
              width={800}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        <div className="bg-[#0a3542] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 p-2 sm:p-2 xl:p-3 rounded-[12px] mb-8 md:mb-12">
          <div className="bg-[#0d4a5c] flex gap-2 lg:gap-2.5 items-center py-2 px-2 sm:py-2 sm:px-2.5 lg:px-3 rounded-[12px] min-w-0">
            <div className="flex items-center shrink-0">
              <Car className="w-6 h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
            </div>
            <div className="flex flex-col gap-[4px] items-start min-w-0 flex-1">
              <div className="flex gap-[6px] lg:gap-[8px] items-baseline">
                <span className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-[#27C7FF] leading-none">+</span>
                <p className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-white leading-none">
                  {t("stats.transfers.number")}
                </p>
              </div>
              <p className="text-[11px] md:text-[11px] lg:text-[13px] xl:text-[15px] text-white leading-tight">
                {t("stats.transfers.label")}
              </p>
            </div>
          </div>

          <div className="bg-[#0d4a5c] flex gap-2 lg:gap-2.5 items-center py-2 px-2 sm:py-2 sm:px-2.5 lg:px-3 rounded-[12px] min-w-0">
            <div className="flex items-center shrink-0">
              <Users className="w-6 h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
            </div>
            <div className="flex flex-col gap-[4px] items-start min-w-0 flex-1">
              <div className="flex gap-[6px] lg:gap-[8px] items-baseline">
                <span className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-[#27C7FF] leading-none">+</span>
                <p className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-white leading-none">
                  {t("stats.customers.number")}
                </p>
              </div>
              <p className="text-[11px] md:text-[11px] lg:text-[13px] xl:text-[15px] text-white leading-tight">
                {t("stats.customers.label")}
              </p>
            </div>
          </div>

          <div className="bg-[#0d4a5c] flex gap-2 lg:gap-2.5 items-center py-2 px-2 sm:py-2 sm:px-2.5 lg:px-3 rounded-[12px] min-w-0">
            <div className="flex items-center shrink-0">
              <Leaf className="w-6 h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
            </div>
            <div className="flex flex-col gap-[4px] items-start min-w-0 flex-1">
              <div className="flex gap-[6px] lg:gap-[8px] items-baseline">
                <span className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-[#27C7FF] leading-none">+</span>
                <p className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-white leading-none">
                  {t("stats.co2.number")}
                </p>
              </div>
              <p className="text-[11px] md:text-[11px] lg:text-[13px] xl:text-[15px] text-white leading-tight">
                {t("stats.co2.label")}
              </p>
            </div>
          </div>

          <div className="bg-[#0d4a5c] flex gap-2 lg:gap-2.5 items-center py-2 px-2 sm:py-2 sm:px-2.5 lg:px-3 rounded-[12px] min-w-0">
            <div className="flex items-center shrink-0">
              <MapPin className="w-6 h-6 lg:w-7 lg:h-7 text-[#27C7FF]" />
            </div>
            <div className="flex flex-col gap-[4px] items-start min-w-0 flex-1">
              <div className="flex gap-[6px] lg:gap-[8px] items-baseline">
                <span className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-[#27C7FF] leading-none">+</span>
                <p className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold text-white leading-none">
                  {t("stats.distance.number")}
                </p>
              </div>
              <p className="text-[11px] md:text-[11px] lg:text-[13px] xl:text-[15px] text-white leading-tight">
                {t("stats.distance.label")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div
            className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
            style={{
              background: "linear-gradient(216.738deg, rgba(233, 249, 255, 0.38) 30.279%, rgba(188, 238, 255, 0.38) 106.2%)"
            }}
          >
            <div className="bg-[#27c7ff] flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0">
              <HeartHandshake className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-white" />
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full text-[#0e4659]">
              <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">
                {t("features.reliable.title")}
              </h3>
              <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">
                {t("features.reliable.description")}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
            style={{
              background: "linear-gradient(216.738deg, rgba(233, 249, 255, 0.38) 30.279%, rgba(188, 238, 255, 0.38) 106.2%)"
            }}
          >
            <div className="bg-[#27c7ff] flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0">
                <svg width="21" height="27" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-white">
                    <path d="M10.0588 16.8083C13.2333 16.8083 15.8067 14.2349 15.8067 11.0604C15.8067 7.88593 13.2333 5.3125 10.0588 5.3125C6.88434 5.3125 4.31091 7.88593 4.31091 11.0604C4.31091 14.2349 6.88434 16.8083 10.0588 16.8083Z" stroke="white" strokeWidth="1.72438" />
                    <path d="M19.2555 26.0053C19.2555 23.5662 18.2866 21.2269 16.5619 19.5022C14.8372 17.7775 12.498 16.8086 10.0588 16.8086C7.61974 16.8086 5.28053 17.7775 3.55582 19.5022C1.83111 21.2269 0.862183 23.5662 0.862183 26.0053" stroke="white" strokeWidth="1.72438" />
                    <path d="M2.6991 3.60488C8.44122 -1.19326 14.4709 1.28913 17.4125 3.61841C17.8334 3.95169 17.9098 4.54308 17.6002 4.98169C17.4264 5.22783 17.2105 5.51999 16.9563 5.83795C15.5742 7.56676 13.0616 10.058 10.0588 10.058C7.05599 10.058 4.54341 7.56676 3.1613 5.83795C2.90711 5.51999 2.69116 5.22783 2.51743 4.98169C2.20784 4.54308 2.28713 3.94913 2.6991 3.60488Z" stroke="white" strokeWidth="1.72438" />
                </svg>
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full text-[#0e4659]">
              <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">
                {t("features.professional.title")}
              </h3>
              <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">
                {t("features.professional.description")}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
            style={{
              background: "linear-gradient(216.738deg, rgba(233, 249, 255, 0.38) 30.279%, rgba(188, 238, 255, 0.38) 106.2%)"
            }}
          >
            <div className="bg-[#27c7ff] flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0">
              <CalendarClock className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-white" />
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full text-[#0e4659]">
              <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">
                {t("features.available.title")}
              </h3>
              <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">
                {t("features.available.description")}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
            style={{
              background: "linear-gradient(216.738deg, rgba(233, 249, 255, 0.38) 30.279%, rgba(188, 238, 255, 0.38) 106.2%)"
            }}
          >
            <div className="bg-[#27c7ff] flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0">
              <Settings2 className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-white" />
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full text-[#0e4659]">
              <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">
                {t("features.custom.title")}
              </h3>
              <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">
                {t("features.custom.description")}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
            style={{
              background: "linear-gradient(216.738deg, rgba(233, 249, 255, 0.38) 30.279%, rgba(188, 238, 255, 0.38) 106.2%)"
            }}
          >
            <div className="bg-[#27c7ff] flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0">
              <TicketX className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-white" />
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full text-[#0e4659]">
              <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">
                {t("features.cancellation.title")}
              </h3>
              <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">
                {t("features.cancellation.description")}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
            style={{
              background: "linear-gradient(216.738deg, rgba(233, 249, 255, 0.38) 30.279%, rgba(188, 238, 255, 0.38) 106.2%)"
            }}
          >
            <div className="bg-[#27c7ff] flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0">
              <MapPinned className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] text-white" />
            </div>
            <div className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full text-[#0e4659]">
              <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">
                {t("features.meetingPoint.title")}
              </h3>
              <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">
                {t("features.meetingPoint.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-[40px] md:mb-[60px] md:mt-[120px]">
          <h3 className="text-[24px] md:text-[32px] font-bold text-[#222] text-center mb-6 md:mb-10">
            {t("resources.title")}
          </h3>
          
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex flex-col gap-5 items-start w-[280px]">
              <div className="flex gap-4 items-center w-full group">
                <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                  <Award className="w-[26px] h-[26px] text-[#27c7ff] transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[18px] font-semibold text-[#0e4659] leading-[1.2]">
                  {t("resources.reputation")}
                </p>
              </div>
              <div className="flex gap-4 items-center group">
                <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                  <CreditCard className="w-[24px] h-[24px] text-[#27c7ff] transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[18px] font-semibold text-[#0e4659] leading-[1.2]">
                  {t("resources.noFees")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 items-start w-[280px]">
              <div className="flex gap-4 items-center w-full group">
                <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                  <Infinity className="w-[24px] h-[24px] text-[#27c7ff] transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[18px] font-semibold text-[#0e4659] leading-[1.2]">
                  {t("resources.tollsIncluded")}
                </p>
              </div>
              <div className="flex gap-4 items-center group">
                <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                  <CheckCircle className="w-[24px] h-[24px] text-[#27c7ff] transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[18px] font-semibold text-[#0e4659] leading-[1.2]">
                  {t("resources.freeCancellation")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 items-start w-[280px]">
              <div className="flex gap-4 items-center w-full group">
                <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                  <UserStar className="w-[24px] h-[24px] text-[#27c7ff] transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[18px] font-semibold text-[#0e4659] leading-[1.2]">
                  {t("resources.professionalDrivers")}
                </p>
              </div>
              <div className="flex gap-4 items-center group">
                <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                  <Handshake className="w-[24px] h-[24px] text-[#27c7ff] transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[18px] font-semibold text-[#0e4659] leading-[1.2]">
                  {t("resources.meetAndGreet")}
                </p>
              </div>
            </div>
          </div>

          <div className="md:hidden grid grid-cols-2 gap-2.5 w-full">
            <div className="flex gap-2.5 items-center group">
              <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                <Award className="w-[20px] h-[20px] text-[#27c7ff] transition-transform group-hover:scale-105" />
              </div>
              <p className="text-[13px] font-semibold text-[#0e4659] leading-[1.2] flex-1">
                {t("resources.reputation")}
              </p>
            </div>

            <div className="flex gap-2.5 items-center group">
              <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                <CreditCard className="w-[20px] h-[20px] text-[#27c7ff] transition-transform group-hover:scale-105" />
              </div>
              <p className="text-[13px] font-semibold text-[#0e4659] leading-[1.2] flex-1">
                {t("resources.noFees")}
              </p>
            </div>

            <div className="flex gap-2.5 items-center group">
              <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                <Infinity className="w-[20px] h-[20px] text-[#27c7ff] transition-transform group-hover:scale-105" />
              </div>
              <p className="text-[13px] font-semibold text-[#0e4659] leading-[1.2] flex-1">
                {t("resources.tollsIncluded")}
              </p>
            </div>

            <div className="flex gap-2.5 items-center group">
              <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                <Handshake className="w-[20px] h-[20px] text-[#27c7ff] transition-transform group-hover:scale-105" />
              </div>
              <p className="text-[13px] font-semibold text-[#0e4659] leading-[1.2] flex-1">
                {t("resources.meetAndGreet")}
              </p>
            </div>

            <div className="flex gap-2.5 items-center group">
              <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                <CheckCircle className="w-[20px] h-[20px] text-[#27c7ff] transition-transform group-hover:scale-105" />
              </div>
              <p className="text-[13px] font-semibold text-[#0e4659] leading-[1.2] flex-1">
                {t("resources.freeCancellation")}
              </p>
            </div>

            <div className="flex gap-2.5 items-center group">
              <div className="border-[#27c7ff] border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all group-hover:shadow-lg group-hover:shadow-[#27c7ff]/30">
                <UserStar className="w-[20px] h-[20px] text-[#27c7ff] transition-transform group-hover:scale-105" />
              </div>
              <p className="text-[13px] font-semibold text-[#0e4659] leading-[1.2] flex-1">
                {t("resources.professionalDrivers")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}