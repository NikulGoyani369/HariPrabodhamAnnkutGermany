import { useEffect, useState } from 'react'

interface Countdown { d: number; h: number; m: number; s: number }

export function useCountdown(targetISO: string): Countdown {
  const [t, setT] = useState<Countdown>({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const target = new Date(targetISO).getTime()
    const tick = () => {
      const diff = target - Date.now()
      if (Number.isNaN(target) || diff <= 0) {
        setT({ d: 0, h: 0, m: 0, s: 0 })
        return
      }
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return t
}
