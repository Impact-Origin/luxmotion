"use client"

interface ApplicationProgressProps {
  label: string
  currentStep: number
  totalSteps: number
}

export function ApplicationProgress({ label, currentStep, totalSteps }: ApplicationProgressProps) {
  const pct = Math.max(0, Math.min(1, currentStep / totalSteps))

  return (
    <div className="bg-white w-full flex flex-col items-center px-4 py-[10px]">
      <div className="w-full max-w-[600px] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[12px] font-medium uppercase tracking-[1.1px] text-[#696969]">
          <span>{label}</span>
          <span>{currentStep}/{totalSteps}</span>
        </div>
        <div className="relative h-[4px] w-full bg-[rgba(28,27,24,0.08)]">
          <div
            className="absolute left-0 top-0 h-[4px] bg-[#a08248] transition-[width] duration-300 ease-out"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
