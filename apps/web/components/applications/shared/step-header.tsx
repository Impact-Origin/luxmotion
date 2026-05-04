import { SERIF_FONT } from "./fonts"

interface StepHeaderProps {
  title: string
  subtitle?: string
}

export function StepHeader({ title, subtitle }: StepHeaderProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1
        className="text-[32px] font-medium leading-none text-[#1c1b18]"
        style={SERIF_FONT}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="text-[14px] leading-[1.3] text-[#696969]">{subtitle}</p>
      ) : null}
    </div>
  )
}
