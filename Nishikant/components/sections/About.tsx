"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

const FEATURES = [
  "Innovative Learning",
  "Experienced Teachers",
  "Modern Infrastructure",
  "100% Student Support",
]

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Side - 2 Images Overlapping */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[450px] lg:h-[550px] w-full"
          >
            {/* Main large image */}
            <div className="absolute top-0 left-0 w-3/4 h-4/5 rounded-3xl overflow-hidden shadow-xl">
              <Image 
                src="/images/gallery-library.png" 
                alt="Student smiling" 
                fill
                className="object-cover"
              />
            </div>
            
            {/* Second overlapping small image */}
            <div className="absolute bottom-4 right-0 w-[55%] h-[50%] rounded-3xl overflow-hidden shadow-2xl border-[8px] border-white z-10">
              <Image 
                src="/images/gallery-science.png" 
                alt="Students in lab" 
                fill
                className="object-cover"
              />
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-0 left-8 bg-[#1b4332] text-white shadow-xl p-5 lg:p-6 rounded-2xl z-20 hidden sm:block"
            >
              <div className="text-3xl lg:text-4xl font-extrabold mb-1">28+</div>
              <div className="text-xs lg:text-sm font-medium opacity-90">Years of<br/>Excellence</div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-primary font-extrabold tracking-widest text-sm uppercase mb-3">
                WELCOME TO GLOBAL SCHOOL
              </h4>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                We're here to help your child <span className="text-primary">grow & succeed</span>
              </h2>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                At Global School, we provide a nurturing environment that encourages students to explore, learn and excel in every field of life.
              </p>

              <ul className="space-y-4 mb-10">
                {FEATURES.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 text-secondary-foreground font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 group">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
