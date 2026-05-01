"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { GlassCard } from "@/components/ui/GlassCard"
import { BookOpen, Monitor, Microscope, Dumbbell, Palette, Music } from "lucide-react"

const FACILITIES = [
  {
    icon: <Monitor className="h-8 w-8 text-indigo-600" />,
    title: "Smart Classrooms",
    description: "Interactive digital boards and modern teaching aids for enhanced learning.",
    color: "bg-indigo-50"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    title: "Digital Library",
    description: "Vast collection of books, journals, and digital resources for research.",
    color: "bg-blue-50"
  },
  {
    icon: <Microscope className="h-8 w-8 text-green-600" />,
    title: "Science Labs",
    description: "Fully equipped Physics, Chemistry, and Biology labs for practicals.",
    color: "bg-green-50"
  },
  {
    icon: <Dumbbell className="h-8 w-8 text-orange-600" />,
    title: "Sports Complex",
    description: "Indoor and outdoor facilities including swimming pool and courts.",
    color: "bg-orange-50"
  },
  {
    icon: <Palette className="h-8 w-8 text-pink-600" />,
    title: "Art Studio",
    description: "Creative spaces for fine arts, painting, and craft activities.",
    color: "bg-pink-50"
  },
  {
    icon: <Music className="h-8 w-8 text-purple-600" />,
    title: "Music Room",
    description: "Dedicated acoustic rooms with various classical and western instruments.",
    color: "bg-purple-50"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function Facilities() {
  return (
    <section id="facilities" className="py-24 bg-secondary  relative">
      <div className="container px-4 md:px-6 relative z-10">
        <SectionHeading 
          title="World-Class Facilities" 
          subtitle="We provide an environment that stimulates learning and encourages students to explore their full potential."
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {FACILITIES.map((facility, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassCard className="h-full p-8 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 ${facility.color}`}>
                  {facility.icon}
                </div>
                <h3 className="text-xl font-bold text-main mb-3">
                  {facility.title}
                </h3>
                <p className="text-sub leading-relaxed">
                  {facility.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
