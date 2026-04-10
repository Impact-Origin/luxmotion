"use client"

import { forwardRef, type ReactNode } from "react"
import { X } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

interface InputWithIconProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  showClear?: boolean
  rightIcon?: ReactNode
  containerClassName?: string
  inputClassName?: string
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  (
    {
      icon,
      value,
      onChange,
      onClear,
      showClear = true,
      rightIcon,
      containerClassName,
      inputClassName,
      className,
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      if (onClear) {
        onClear()
      } else {
        onChange("")
      }
    }

    const hasRightContent = (showClear && value) || rightIcon

    return (
      <div className={cn("relative", containerClassName)}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfbfbf]">
          {icon}
        </div>
        <Input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "pl-10 h-12 border-[#e0e0e0] text-[#222222] placeholder:text-[#a2a2a2]",
            hasRightContent ? "pr-10" : "pr-4",
            rightIcon && showClear && value ? "pr-16" : "",
            inputClassName,
            className
          )}
          {...props}
        />
        {hasRightContent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {showClear && value && (
              <button
                type="button"
                onClick={handleClear}
                className="w-5 h-5 text-[#bfbfbf] hover:text-[#808080] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)

InputWithIcon.displayName = "InputWithIcon"

