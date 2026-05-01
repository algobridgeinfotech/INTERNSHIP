"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ArrowRight, CheckCircle2, ClipboardList, Calendar, Users } from "lucide-react"

const STEPS = [
  { icon: <ClipboardList className="h-6 w-6 text-primary" />, title: "Submit Application", desc: "Fill out the online application form with required documents." },
  { icon: <Calendar className="h-6 w-6 text-primary" />, title: "Schedule Interview", desc: "Our admissions team will contact you for an interaction session." },
  { icon: <Users className="h-6 w-6 text-primary" />, title: "Student Evaluation", desc: "A brief assessment to understand the student's learning level." },
  { icon: <CheckCircle2 className="h-6 w-6 text-success" />, title: "Enrollment", desc: "Receive admission offer and complete the fee payment." },
]

export function Admission() {
  return (
    <section id="admissions" className="py-24 relative overflow-hidden bg-sky-600 dark:bg-sky-900">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
              Admissions Open for <br />
              <span className="text-sky-200">2026-2027</span>
            </h2>
            <p className="text-sky-100 text-lg mb-8 max-w-xl">
              Join the Global School family. We are currently accepting applications for classes Pre-K through Grade 12. Secure your child's future today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50 shadow-xl border-none">
                Start Application <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-sky-300 text-white hover:bg-primary hover:text-white dark:border-sky-700 dark:text-sky-200 dark:hover:bg-sky-800">
                Download Prospectus
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white  rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-foreground  mb-8">Admission Process</h3>
            
            <div className="space-y-6">
              {STEPS.map((step, index) => (
                <div key={index} className="flex gap-4 relative">
                  {/* Connector Line */}
                  {index !== STEPS.length - 1 && (
                    <div className="absolute top-10 left-6 w-0.5 h-12 bg-secondary  -translate-x-1/2"></div>
                  )}
                  
                  <div className="h-12 w-12 rounded-full bg-sky-50 dark:bg-primary/10 flex items-center justify-center flex-shrink-0 z-10 border border-sky-100 dark:border-primary/20">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground ">{step.title}</h4>
                    <p className="text-muted-foreground  text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
