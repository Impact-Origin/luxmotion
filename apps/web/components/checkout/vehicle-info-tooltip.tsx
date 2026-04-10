"use client"

import { X, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface VehicleInfoTooltipProps {
  vehicleName: string
  onClose: () => void
}

type DrawerPhase = "entering" | "entered" | "exiting"

const EXIT_ANIMATION_MS = 320

export function VehicleInfoTooltip({ vehicleName, onClose }: VehicleInfoTooltipProps) {
  const [phase, setPhase] = useState<DrawerPhase>("entering")
  const drawerRef = useRef<HTMLDivElement>(null)
  const onCloseCalledRef = useRef(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhase("entered")
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleClose = () => {
    if (phase !== "entered") return
    setPhase("exiting")
    onCloseCalledRef.current = false
  }

  useEffect(() => {
    if (phase !== "exiting") return
    const timeout = window.setTimeout(() => {
      if (!onCloseCalledRef.current) {
        onCloseCalledRef.current = true
        onClose()
      }
    }, EXIT_ANIMATION_MS)
    return () => window.clearTimeout(timeout)
  }, [phase, onClose])

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== drawerRef.current) return
    if (phase === "exiting" && (e.propertyName === "transform" || e.propertyName === "opacity")) {
      if (!onCloseCalledRef.current) {
        onCloseCalledRef.current = true
        onClose()
      }
    }
  }

  const handleBackdropClick = () => {
    if (phase !== "entered") return
    handleClose()
  }

  return (
    <div
      data-phase={phase}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/20 max-md:transition-opacity max-md:duration-300 max-md:data-[phase=entering]:opacity-0 max-md:data-[phase=entered]:opacity-100 max-md:data-[phase=exiting]:opacity-0 max-md:data-[phase=exiting]:pointer-events-none md:opacity-100"
      onClick={handleBackdropClick}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={vehicleName}
        data-phase={phase}
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto flex flex-col max-md:translate-y-full max-md:data-[phase=entered]:translate-y-0 max-md:data-[phase=exiting]:translate-y-full max-md:transition-transform max-md:duration-300 max-md:ease-out md:animate-in md:fade-in md:zoom-in-95 md:duration-200 md:data-[phase=exiting]:opacity-0 md:transition-opacity md:duration-200"
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 relative px-4 md:px-8 pt-4 md:pt-8 pb-2 md:pb-0 md:mb-6">
          <h2 className="text-lg md:text-4xl font-bold text-center text-[#222222] pr-12 md:pr-0">
            {vehicleName}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 md:right-6 md:top-6 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] text-[#222222] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-8 pb-6 md:pb-8 pt-2 md:pt-0">
          <div className="bg-[#E8F9F0] border-2 border-[#00D47E] rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="text-base md:text-2xl font-bold text-[#0E4659] mb-3 md:mb-4">Incluído</h3>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Cartão de boas-vindas</p>
                  <p className="text-[#0E4659] text-xs md:text-sm">(Meeting sign)</p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Motorista profissional e de confiança</p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Serviço porta-a-porta</p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Combustível</p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">IVA e taxas</p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">
                  Tempo de espera: 45min aeroporto / 15min em locais
                </p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Monitorização de voo</p>
                  <p className="text-[#0E4659] text-xs md:text-sm">(pick-up aeroporto)</p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Wi-Fi a bordo</p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-[#00D47E] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Portagens e taxas especiais incluídas</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF0F0] border-2 border-[#FF4D4D] rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="text-base md:text-2xl font-bold text-[#0E4659] mb-3 md:mb-4">Não incluído</h3>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start gap-2 md:gap-3">
                <X className="w-4 h-4 md:w-5 md:h-5 text-[#FF4D4D] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Banco bebé</p>
                  <p className="text-[#0E4659] text-xs md:text-sm">(extra: +5€)</p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <X className="w-4 h-4 md:w-5 md:h-5 text-[#FF4D4D] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Horas extra / espera além do incluído</p>
              </div>

              <div className="flex items-start gap-2 md:gap-3">
                <X className="w-4 h-4 md:w-5 md:h-5 text-[#FF4D4D] flex-shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-[#0E4659] text-sm md:text-base font-semibold leading-snug">Gorjetas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
