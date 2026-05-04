import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@workspace/ui/lib/utils"

type LightInputProps = InputHTMLAttributes<HTMLInputElement>

export const LightInput = forwardRef<HTMLInputElement, LightInputProps>(
  function LightInput({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-[44px] px-[13px] bg-white border border-[rgba(28,27,24,0.08)] text-[14px] text-[#1c1b18] placeholder:text-[rgba(140,134,128,0.6)] focus:outline-none focus:border-[#a08248] transition-colors",
          className,
        )}
        {...rest}
      />
    )
  },
)
