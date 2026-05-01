"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Building2, Trophy, ShieldCheck } from "lucide-react"

const STATS = [
  { 
    icon: <Users className="h-8 w-8 text-white/80" />,
    label: "Students", 
    value: 5000, 
    suffix: "+" 
  },
  { 
    icon: <Building2 className="h-8 w-8 text-white/80" />,
    label: "Qualified Teachers", 
    value: 120, 
    suffix: "+" 
  },
  { 
    icon: <Trophy className="h-8 w-8 text-white/80" />,
    label: "Awards Won", 
    value: 80, 
    suffix: "+" 
  },
  { 
    icon: <ShieldCheck className="h-8 w-8 text-white/80" />,
    label: "Pass Percentage", 
    value: 98, 
    suffix: "%" 
  },
]

function AnimatedCounter({ value, duration = 2 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }
    requestAnimationFrame(updateCounter)
  }, [isInView, value, duration])

  return <span ref={ref}>{count}</span>
}

export function Achievements() {
  return (
    <section className="py-12 bg-[#143e2a]">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-white/20">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center gap-6 justify-center ${index !== 0 ? 'md:pl-12' : ''}`}
            >
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
