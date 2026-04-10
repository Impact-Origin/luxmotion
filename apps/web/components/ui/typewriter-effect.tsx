"use client"

import { useEffect, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface TypewriterEffectProps {
  words: string[]
  className?: string
  cursorClassName?: string
  typeSpeed?: number
  deleteSpeed?: number
  delay?: number
  loop?: boolean
}

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typeSpeed = 50,
  deleteSpeed = 50,
  delay = 2000,
  loop = true,
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    if (!currentWord) return

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, delay)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (currentText.length > 0) {
        const deleteTimeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, deleteSpeed)
        return () => clearTimeout(deleteTimeout)
      } else {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => {
          const next = (prev + 1) % words.length
          if (next === 0 && !loop) {
            return prev
          }
          return next
        })
      }
    } else {
      if (currentWord && currentText.length < currentWord.length) {
        const typeTimeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        }, typeSpeed)
        return () => clearTimeout(typeTimeout)
      } else {
        setIsPaused(true)
      }
    }
  }, [currentText, currentWordIndex, isDeleting, isPaused, words, typeSpeed, deleteSpeed, delay, loop])

  return (
    <span className={cn("inline-block", className)}>
      {currentText}
      <span
        className={cn(
          "inline-block h-4 w-[2px] bg-current ml-1 animate-pulse",
          cursorClassName
        )}
      />
    </span>
  )
}

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  startDelay?: number
  deleteSpeed?: number
  pauseDelay?: number
}

export function TypewriterText({ 
  text, 
  className, 
  delay = 50, 
  startDelay = 0,
  deleteSpeed = 30,
  pauseDelay = 2000
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!hasStarted && startDelay > 0) {
      const startTimeout = setTimeout(() => {
        setHasStarted(true)
      }, startDelay)
      return () => clearTimeout(startTimeout)
    }
    setHasStarted(true)
  }, [hasStarted, startDelay])

  useEffect(() => {
    if (!hasStarted) return

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDelay)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        const deleteTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1))
        }, deleteSpeed)
        return () => clearTimeout(deleteTimeout)
      } else {
        setIsDeleting(false)
        setCurrentIndex(0)
      }
    } else {
      if (currentIndex < text.length) {
        const typeTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }, delay)
        return () => clearTimeout(typeTimeout)
      } else {
        setIsPaused(true)
      }
    }
  }, [currentIndex, text, delay, hasStarted, isDeleting, isPaused, displayedText, deleteSpeed, pauseDelay])

  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setHasStarted(false)
    setIsDeleting(false)
    setIsPaused(false)
  }, [text])

  return (
    <span 
      className={className} 
      style={{ 
        display: 'inline-block',
        minHeight: '1.2em',
        whiteSpace: 'nowrap'
      }}
    >
      {displayedText || '\u00A0'}
    </span>
  )
}
