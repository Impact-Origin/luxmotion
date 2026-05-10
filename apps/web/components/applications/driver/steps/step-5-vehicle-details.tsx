"use client"

import { useRef } from "react"
import Image from "next/image"
import { Check, Minus, Plus, Upload } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  FieldLabel,
  LightInput,
  LightSelect,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

const CHILD_SEAT_KEYS = ["baby", "child", "booster"] as const
type ChildSeatKey = (typeof CHILD_SEAT_KEYS)[number]

const AMENITY_VALUES = [
  "usbCharger",
  "wifi",
  "pos",
  "magazines",
  "refreshTowels",
] as const

function SectionLabel({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex items-center gap-3 w-full pt-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#1c1b18] leading-none whitespace-nowrap">
        {index}. {label}
      </span>
      <span className="flex-1 h-px bg-[rgba(28,27,24,0.08)]" aria-hidden />
    </div>
  )
}

function PhotoUploadTile({
  index,
  file,
  onSelect,
  hint,
}: {
  index: number
  file: File | null
  onSelect: (file: File | null) => void
  hint: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <label className="bg-[#ede8df] border border-[rgba(28,27,24,0.06)] flex flex-col items-center justify-center gap-1 h-[88px] cursor-pointer hover:bg-[#e5dfd2] transition-colors">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
      <Upload size={18} strokeWidth={1.6} className="text-[#a08248]" />
      <span className="text-[12px] font-semibold text-[#1c1b18] leading-none">
        {file ? file.name.slice(0, 18) : `Foto ${index}`}
      </span>
      <span className="text-[10px] text-[#696969] leading-none">{hint}</span>
    </label>
  )
}

function CounterControl({
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="size-8 flex items-center justify-center bg-white border border-[rgba(28,27,24,0.08)] text-[#a08248] hover:bg-[rgba(154,117,53,0.07)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={value <= min}
        aria-label="decrement"
      >
        <Minus size={14} strokeWidth={1.6} />
      </button>
      <div className="w-10 flex items-center justify-center border-y-[1.56px] border-[rgba(28,27,24,0.08)]">
        <span className="text-[14px] font-medium text-[#696969] leading-[21px]">{value}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="size-8 flex items-center justify-center bg-white border border-[rgba(28,27,24,0.08)] text-[#a08248] hover:bg-[rgba(154,117,53,0.07)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={value >= max}
        aria-label="increment"
      >
        <Plus size={14} strokeWidth={1.6} />
      </button>
    </div>
  )
}

function ChildSeatCard({
  imageSrc,
  title,
  ageRange,
  count,
  onChange,
}: {
  imageSrc: string
  title: string
  ageRange: string
  count: number
  onChange: (next: number) => void
}) {
  return (
    <div className="bg-white border border-[rgba(28,27,24,0.08)] flex flex-col items-center gap-2 p-4">
      <span className="relative w-full h-[100px]">
        <Image src={imageSrc} alt={title} fill sizes="160px" className="object-contain" />
      </span>
      <span className="text-[14px] font-semibold text-[#0d0d0d] leading-none mt-1">
        {title}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#696969] leading-none">
        {ageRange}
      </span>
      <CounterControl value={count} onChange={onChange} />
    </div>
  )
}

function SurfboardIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.872727}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15.9986 1.45703L1.88949 15.5661M8.45676 14.7661C6.72822 15.6037 4.82829 16.027 2.90767 16.0025C2.5219 16.0025 2.15193 15.8492 1.87915 15.5765C1.60637 15.3037 1.45313 14.9337 1.45312 14.5479C1.45312 7.34794 7.34403 1.45703 14.544 1.45703H15.9986V2.91158C16.011 5.1064 15.4713 7.26911 14.4292 9.20081C13.3871 11.1325 11.876 12.7712 10.0349 13.9661" />
      <path d="M5.08984 12.3683C7.05348 12.3683 8.65348 14.0411 8.72621 16.0047C9.22221 15.543 9.61648 14.983 9.88382 14.3604C10.1512 13.7377 10.2857 13.0662 10.2789 12.3886C10.272 11.7111 10.1239 11.0424 9.84407 10.4253C9.56421 9.80817 9.15871 9.25623 8.65348 8.80469" />
    </svg>
  )
}

function SurfboardOptionRow({
  checked,
  onToggle,
  label,
}: {
  checked: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="w-full bg-white flex items-center gap-2 p-4 text-left hover:bg-[rgba(28,27,24,0.02)] transition-colors"
    >
      <span className="size-6 shrink-0 relative flex items-center justify-center">
        <span className="size-[18px] rounded-[2px] border border-[rgba(28,27,24,0.08)] bg-white flex items-center justify-center">
          {checked ? <Check size={12} strokeWidth={2.5} className="text-[#a08248]" /> : null}
        </span>
      </span>
      <span className="flex-1 min-w-0 flex items-center gap-4">
        <span className="size-8 shrink-0 bg-[rgba(201,169,110,0.08)] border-[0.727px] border-[rgba(201,169,110,0.18)] flex items-center justify-center text-[#a08248]">
          <SurfboardIcon size={17} />
        </span>
        <span className="flex-1 min-w-0 text-[12px] font-semibold text-[#1a1a1a] leading-none">
          {label}
        </span>
      </span>
    </button>
  )
}

function AmenityChip({
  selected,
  onToggle,
  label,
}: {
  selected: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        "bg-white flex items-center gap-2 px-3 h-[36px] transition-colors border " +
        (selected
          ? "border-[#a08248]"
          : "border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.18)]")
      }
      aria-pressed={selected}
    >
      <span className="size-[16px] shrink-0 rounded-[2px] bg-[rgba(154,117,53,0.22)] border border-[rgba(154,117,53,0.22)] flex items-center justify-center">
        {selected ? <Check size={10} strokeWidth={3} className="text-[#a08248]" /> : null}
      </span>
      <span className="text-[13px] text-[#1c1b18]">{label}</span>
    </button>
  )
}

function rangeOptions(start: number, end: number, step = 1) {
  const out: { value: string; label: string }[] = []
  for (let i = start; i <= end; i += step) {
    const v = String(i)
    out.push({ value: v, label: v })
  }
  return out
}

export function DriverStepVehicleDetails() {
  const t = useTranslations("driverApplication.stepVehicleDetails")
  const tCommon = useTranslations("common")
  const { state, updateVehicle, nextStep, prevStep } = useDriverApplication()
  const { vehicle } = state

  const yearOptions = rangeOptions(2000, new Date().getFullYear()).reverse()
  const paxOptions = rangeOptions(1, 16)
  const bagOptions = rangeOptions(0, 12)

  const brandOptions = ["mercedes", "bmw", "audi", "tesla", "porsche", "volkswagen", "rollsRoyce", "ferrari", "other"].map((v) => ({
    value: v,
    label: t(`brands.${v}`),
  }))

  const colorOptions = ["black", "white", "silver", "grey", "blue", "red", "other"].map((v) => ({
    value: v,
    label: t(`colors.${v}`),
  }))

  const ownershipOptions = ["owned", "leased", "rented", "company"].map((v) => ({
    value: v,
    label: t(`ownership.${v}`),
  }))

  const tvdeOptions = [
    { value: "yes", label: tCommon("yes") },
    { value: "no", label: tCommon("no") },
  ]

  function setInteriorPhoto(idx: number, file: File | null) {
    const next = vehicle.interiorPhotos.slice()
    next[idx] = file
    updateVehicle({ interiorPhotos: next })
  }

  function setExteriorPhoto(idx: number, file: File | null) {
    const next = vehicle.exteriorPhotos.slice()
    next[idx] = file
    updateVehicle({ exteriorPhotos: next })
  }

  function setChildSeat(key: ChildSeatKey, value: number) {
    updateVehicle({ childSeats: { ...vehicle.childSeats, [key]: value } })
  }

  function toggleAmenity(value: string) {
    const next = vehicle.amenities.includes(value)
      ? vehicle.amenities.filter((a) => a !== value)
      : [...vehicle.amenities, value]
    updateVehicle({ amenities: next })
  }

  const canContinue =
    vehicle.brand.length > 0 &&
    vehicle.model.trim().length > 0 &&
    vehicle.plate.trim().length > 0 &&
    vehicle.color.length > 0 &&
    vehicle.year.length > 0 &&
    vehicle.ownership.length > 0 &&
    vehicle.passengerCapacity.length > 0 &&
    vehicle.luggageCapacity.length > 0 &&
    vehicle.tvdeLicensed.length > 0

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <SectionLabel index={1} label={t("section.info")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.brand")}</FieldLabel>
          <LightSelect
            value={vehicle.brand}
            onChange={(value) => updateVehicle({ brand: value })}
            placeholder={t("selectPlaceholder")}
            options={brandOptions}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.model")}</FieldLabel>
          <LightInput
            type="text"
            placeholder="Ex. 220d"
            value={vehicle.model}
            onChange={(e) => updateVehicle({ model: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.plate")}</FieldLabel>
          <LightInput
            type="text"
            placeholder="Ex. E 220d"
            value={vehicle.plate}
            onChange={(e) => updateVehicle({ plate: e.target.value.toUpperCase() })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.color")}</FieldLabel>
          <LightSelect
            value={vehicle.color}
            onChange={(value) => updateVehicle({ color: value })}
            placeholder={t("selectPlaceholder")}
            options={colorOptions}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.year")}</FieldLabel>
          <LightSelect
            value={vehicle.year}
            onChange={(value) => updateVehicle({ year: value })}
            placeholder={t("selectPlaceholder")}
            options={yearOptions}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.ownership")}</FieldLabel>
          <LightSelect
            value={vehicle.ownership}
            onChange={(value) => updateVehicle({ ownership: value })}
            placeholder={t("selectPlaceholder")}
            options={ownershipOptions}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.passengerCapacity")}</FieldLabel>
          <LightSelect
            value={vehicle.passengerCapacity}
            onChange={(value) => updateVehicle({ passengerCapacity: value })}
            placeholder={t("selectPlaceholder")}
            options={paxOptions}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("fields.luggageCapacity")}</FieldLabel>
          <LightSelect
            value={vehicle.luggageCapacity}
            onChange={(value) => updateVehicle({ luggageCapacity: value })}
            placeholder={t("selectPlaceholder")}
            options={bagOptions}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("fields.tvde.label")}</FieldLabel>
        <LightSelect
          value={vehicle.tvdeLicensed}
          onChange={(value) => updateVehicle({ tvdeLicensed: value })}
          placeholder={t("selectPlaceholder")}
          options={tvdeOptions}
        />
        <span className="text-[12px] text-[#696969] leading-[1.3]">
          {t("fields.tvde.hint")}
        </span>
      </div>

      <SectionLabel index={2} label={t("section.photos")} />
      <p className="text-[12px] text-[#696969] leading-[1.3] -mt-3">
        {t("photos.intro")}
      </p>

      <div className="flex flex-col gap-2 w-full">
        <span className="text-[12px] font-semibold text-[#1a1a1a]">
          {t("photos.interior")}
        </span>
        <div className="grid grid-cols-3 gap-2">
          {vehicle.interiorPhotos.map((file, idx) => (
            <PhotoUploadTile
              key={`int-${idx}`}
              index={idx + 1}
              file={file}
              onSelect={(f) => setInteriorPhoto(idx, f)}
              hint={t("photos.hint")}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <span className="text-[12px] font-semibold text-[#1a1a1a]">
          {t("photos.exterior")}
        </span>
        <div className="grid grid-cols-3 gap-2">
          {vehicle.exteriorPhotos.map((file, idx) => (
            <PhotoUploadTile
              key={`ext-${idx}`}
              index={idx + 1}
              file={file}
              onSelect={(f) => setExteriorPhoto(idx, f)}
              hint={t("photos.hint")}
            />
          ))}
        </div>
      </div>

      <SectionLabel index={3} label={t("section.childSeats")} />
      <p className="text-[12px] text-[#696969] leading-[1.3] -mt-3">
        {t("childSeats.intro")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CHILD_SEAT_KEYS.map((key) => (
          <ChildSeatCard
            key={key}
            imageSrc="/images/cadeira-crianca.jpeg"
            title={t(`childSeats.${key}.title`)}
            ageRange={t(`childSeats.${key}.age`)}
            count={vehicle.childSeats[key]}
            onChange={(v) => setChildSeat(key, v)}
          />
        ))}
      </div>

      <SectionLabel index={4} label={t("section.special")} />
      <SurfboardOptionRow
        checked={vehicle.surfboardRack}
        onToggle={() => updateVehicle({ surfboardRack: !vehicle.surfboardRack })}
        label={t("special.surfboardRack")}
      />

      <SectionLabel index={5} label={t("section.amenities")} />
      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("amenities.label")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {AMENITY_VALUES.map((value) => (
            <AmenityChip
              key={value}
              selected={vehicle.amenities.includes(value)}
              onToggle={() => toggleAmenity(value)}
              label={t(`amenities.${value}`)}
            />
          ))}
        </div>
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue={canContinue}
      />
    </form>
  )
}
