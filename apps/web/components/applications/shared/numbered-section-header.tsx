interface NumberedSectionHeaderProps {
  index: number
  label: string
}

export function NumberedSectionHeader({ index, label }: NumberedSectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="size-8 shrink-0 bg-[#a08248] flex items-center justify-center text-white text-[14px] font-semibold leading-none">
        {index}
      </div>
      <span className="text-[14px] font-semibold uppercase tracking-[0.5px] text-black leading-none">
        {label}
      </span>
    </div>
  )
}
