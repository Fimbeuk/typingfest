'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TypingAreaProps {
  text: string
  onComplete: (stats: { durationMs: number; mistakes: number; wpm: number; cpm: number }) => void
}

// Sons (utiliser Web Audio API pour des sons simples)
const playSound = (type: 'click' | 'buzz') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  if (type === 'click') {
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
  } else {
    oscillator.frequency.value = 200
    oscillator.type = 'sawtooth'
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
  }

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + (type === 'click' ? 0.1 : 0.2))
}

export default function TypingArea({ text, onComplete }: TypingAreaProps) {
  const [userInput, setUserInput] = useState('')
  const [mistakes, setMistakes] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [cpm, setCpm] = useState(0)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const completedRef = useRef(false)

  // Calculer WPM et CPM en temps réel
  useEffect(() => {
    if (startTime === null || userInput.length === 0) return

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000
      const elapsedMinutes = elapsedSeconds / 60

      // WPM : (caractères / 5) / minutes
      const newWpm = (userInput.length / 5) / elapsedMinutes
      // CPM : caractères / minutes
      const newCpm = userInput.length / elapsedMinutes

      setWpm(Math.round(newWpm))
      setCpm(Math.round(newCpm))
    }, 100)

    return () => clearInterval(interval)
  }, [startTime, userInput.length])

  // Vérifier si le texte est complété (uniquement si le dernier caractère est correct)
  useEffect(() => {
    // Réinitialiser le flag de complétion si on recommence
    if (userInput.length === 0) {
      completedRef.current = false
      return
    }

    // Vérifier que le texte est complété et que le dernier caractère est correct
    if (!completedRef.current && userInput.length === text.length && startTime !== null) {
      // Vérifier que le texte saisi correspond exactement au texte attendu
      if (userInput === text) {
        completedRef.current = true
        const durationMs = Date.now() - startTime
        // Calculer WPM et CPM finaux au moment de la complétion
        const elapsedSeconds = durationMs / 1000
        const elapsedMinutes = elapsedSeconds / 60
        const finalWpm = Math.round((userInput.length / 5) / elapsedMinutes)
        const finalCpm = Math.round(userInput.length / elapsedMinutes)
        
        onComplete({
          durationMs,
          mistakes,
          wpm: finalWpm,
          cpm: finalCpm,
        })
      }
    }
  }, [userInput, text, startTime, mistakes, onComplete])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorer les touches spéciales (Shift, Ctrl, Alt, etc.)
    if (event.key.length > 1 && ![' ', 'Enter'].includes(event.key)) {
      return
    }

    // Démarrer le chronomètre au premier caractère
    if (startTime === null && userInput.length === 0) {
      setStartTime(Date.now())
    }

    const nextChar = text[userInput.length]

    // Gérer les espaces - empêcher le scroll seulement si c'est l'espace attendu
    if (event.key === ' ') {
      if (nextChar === ' ') {
        event.preventDefault()
        setUserInput((prev) => prev + ' ')
        playSound('click')
      } else {
        // Espace incorrect
        event.preventDefault()
        setMistakes((prev) => prev + 1)
        setShake(true)
        playSound('buzz')
        setTimeout(() => setShake(false), 200)
      }
      return
    }

    if (event.key === nextChar) {
      // Caractère correct
      setUserInput((prev) => prev + event.key)
      playSound('click')
    } else if (event.key.length === 1) {
      // Caractère incorrect (mais pas une touche spéciale)
      setMistakes((prev) => prev + 1)
      setShake(true)
      playSound('buzz')
      setTimeout(() => setShake(false), 200)
    }
  }, [text, userInput.length, startTime])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getDisplayText = () => {
    const currentIndex = userInput.length
    
    return (
      <div className="relative">
        {/* Texte complet en arrière-plan (gris clair) */}
        <div className="opacity-20 text-gray-400" style={{ fontFamily: 'inherit' }}>
          {text.split('').map((char, index) => (
            <span key={`bg-${index}`}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </div>
        
        {/* Texte tapé et caractère actuel (superposé) */}
        <div className="absolute top-0 left-0">
          {/* Texte déjà tapé en vert */}
          <span className="text-green-600">
            {text.substring(0, currentIndex).split('').map((char, index) => (
              <span key={`typed-${index}`}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </span>
          
          {/* Caractère actuel avec curseur */}
          {currentIndex < text.length && (
            <span
              ref={cursorRef}
              className={`relative inline-block ${
                shake ? 'text-red-500 animate-pulse' : 'text-blue-600'
              }`}
            >
              {text[currentIndex] === ' ' ? '\u00A0' : text[currentIndex]}
              {/* Curseur laser animé */}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  shake ? 'bg-red-500' : 'bg-blue-500'
                } animate-pulse shadow-lg`}
                style={{
                  boxShadow: shake
                    ? '0 0 8px rgba(239, 68, 68, 0.8)'
                    : '0 0 8px rgba(37, 99, 235, 0.8)',
                }}
              />
            </span>
          )}
        </div>
      </div>
    )
  }

  // Scroll automatique vers le curseur
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }, [userInput.length])

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div className="text-sm text-gray-500">
          <span className="mr-4">WPM: <strong className="text-gray-900">{wpm}</strong></span>
          <span className="mr-4">CPM: <strong className="text-gray-900">{cpm}</strong></span>
          <span>Erreurs: <strong className="text-red-500">{mistakes}</strong></span>
        </div>
      </div>
      <div
        ref={inputRef}
        className={`text-lg md:text-xl lg:text-2xl leading-relaxed p-4 md:p-6 bg-gray-50 rounded-lg border-2 ${
          shake ? 'border-red-500 animate-pulse' : 'border-gray-200'
        } transition-all overflow-y-auto max-h-[60vh] md:max-h-[70vh]`}
        style={{
          fontFamily: "'JetBrains Mono', 'Roboto Mono', 'Courier New', monospace",
          letterSpacing: '0.05em',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {getDisplayText()}
      </div>
    </div>
  )
}
