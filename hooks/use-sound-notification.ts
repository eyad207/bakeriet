'use client'

import { useEffect, useRef, useState } from 'react'

export interface SoundNotificationOptions {
  enabled?: boolean
  volume?: number
  soundUrl?: string
}

export function useSoundNotification(options: SoundNotificationOptions = {}) {
  const {
    enabled = true,
    volume = 0.5,
    soundUrl = '/sounds/notification.mp3',
  } = options

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize audio element and fallback audio context
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return

    try {
      // Try to load audio file first
      const audio = new Audio(soundUrl)
      audio.volume = volume
      audio.preload = 'auto'

      audio.addEventListener('canplaythrough', () => {
        setIsLoaded(true)
        setError(null)
      })

      audio.addEventListener('error', () => {
        console.warn(
          'Could not load audio file, falling back to generated sound'
        )
        // Initialize Web Audio API as fallback
        try {
          const AudioContext =
            window.AudioContext ||
            (
              window as typeof window & {
                webkitAudioContext?: typeof window.AudioContext
              }
            ).webkitAudioContext
          if (AudioContext) {
            audioContextRef.current = new AudioContext()
            setIsLoaded(true)
            setError(null)
          } else {
            setError('Audio not supported')
          }
        } catch {
          setError('Audio not supported')
        }
      })

      audioRef.current = audio

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        if (
          audioContextRef.current &&
          audioContextRef.current.state !== 'closed'
        ) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }
    } catch {
      setError('Audio not supported')
      setIsLoaded(false)
    }
  }, [enabled, soundUrl, volume])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Generate a pleasant notification sound using Web Audio API
  const playGeneratedSound = async () => {
    if (!audioContextRef.current) return

    try {
      const context = audioContextRef.current

      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        await context.resume()
      }

      // Create oscillators for a pleasant two-tone notification
      const oscillator1 = context.createOscillator()
      const oscillator2 = context.createOscillator()
      const gainNode = context.createGain()

      // Connect the audio graph
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(context.destination)

      // Set frequencies for a pleasant notification sound (C and E notes)
      oscillator1.frequency.setValueAtTime(523.25, context.currentTime) // C5
      oscillator2.frequency.setValueAtTime(659.25, context.currentTime) // E5

      // Set oscillator types
      oscillator1.type = 'sine'
      oscillator2.type = 'sine'

      // Create volume envelope
      gainNode.gain.setValueAtTime(0, context.currentTime)
      gainNode.gain.linearRampToValueAtTime(
        volume * 0.3,
        context.currentTime + 0.05
      )
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4)

      // Start and stop oscillators
      const now = context.currentTime
      oscillator1.start(now)
      oscillator2.start(now)
      oscillator1.stop(now + 0.4)
      oscillator2.stop(now + 0.4)
    } catch (err) {
      console.warn('Could not play generated sound:', err)
    }
  }

  const playSound = async () => {
    if (!enabled || !isLoaded) return

    try {
      // Try to play audio file first
      if (audioRef.current && audioRef.current.readyState >= 2) {
        audioRef.current.currentTime = 0
        await audioRef.current.play()
      } else if (audioContextRef.current) {
        // Fallback to generated sound
        await playGeneratedSound()
      }
    } catch (err) {
      console.warn('Could not play notification sound:', err)
      // Try generated sound as last resort
      if (audioContextRef.current) {
        await playGeneratedSound()
      }
    }
  }

  return {
    playSound,
    isLoaded,
    error,
    canPlay: enabled && isLoaded && !error,
  }
}
