import type { ReactNode } from "react"

interface FieldLabelProps {
  children: ReactNode
  required?: boolean
  sublabel?: ReactNode
}

export function FieldLabel({ children, required, sublabel }: FieldLabelProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[12px] font-semibold leading-none text-[#1a1a1a]">
        {children}
        {required ? <span className="text-[#e32828]">*</span> : null}
      </span>
      {sublabel ? (
        <span className="text-[12px] font-normal leading-none text-[#696969]">
          {sublabel}
        </span>
      ) : null}
    </div>
  )
}
