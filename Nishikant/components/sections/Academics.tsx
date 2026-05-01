"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { GlassCard } from "@/components/ui/GlassCard"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const ACADEMICS = [
  {
    level: "Primary",
    grades: "Grades 1 to 5",
    description: "Focus on foundational skills, creativity, and instilling a lifelong love for learning in a play-based environment.",
    color: "from-sky-400 to-blue-500",
    delay: 0.1
  },
  {
    level: "Secondary",
    grades: "Grades 6 to 10",
    description: "Comprehensive curriculum promoting critical thinking, independent study, and introduction to specialized subjects.",
    color: "from-blue-500 to-indigo-500",
    delay: 0.2
  },
  {
    level: "Higher Secondary",
    grades: "Grades 11 & 12",
    description: "Pre-university preparation with specialized streams in Science, Commerce, and Humanities with expert guidance.",
    color: "from-indigo-500 to-purple-500",
    delay: 0.3
  }
]

export function Academics() {
  return (
    <section id="academics" className="py-24 relative">
      <div className="container px-4 md:px-6">
        <SectionHeading 
          title="Academic Excellence" 
          subtitle="Our curriculum is designed to challenge and inspire students at every stage of their educational journey."
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {ACADEMICS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: item.delay }}
            >
              <GlassCard className="h-full p-8 flex flex-col relative overflow-hidden group">
                {/* Decorative Top Bar */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${item.color}`} />
                
                <div className="mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-foreground  mb-2">{item.level}</h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-secondary  text-sm font-medium text-muted-foreground ">
                    {item.grades}
                  </div>
                </div>
                
                <p className="text-muted-foreground  mb-8 flex-grow">
                  {item.description}
                </p>

                <Link 
                  href="#" 
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-sky-600  group-hover:translate-x-1 transition-transform"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
