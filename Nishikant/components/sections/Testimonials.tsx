"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { GlassCard } from "@/components/ui/GlassCard"
import { Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Michael R.",
    role: "Parent",
    content: "Global School has been instrumental in my child's overall development. The teachers are incredibly supportive and the facilities are top-notch.",
  },
  {
    name: "Sarah Jenkins",
    role: "Alumni (Batch of 2020)",
    content: "The foundational knowledge and leadership skills I acquired here helped me secure a scholarship at a top university. Truly grateful!",
  },
  {
    name: "David Chen",
    role: "Parent",
    content: "We moved to the city recently and finding this school was a blessing. The inclusive environment made the transition seamless for our daughter.",
  }
]

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">

      
      <div className="container px-4 md:px-6 relative z-10">
        <SectionHeading 
          title="What Parents & Students Say" 
          subtitle="Don't just take our word for it. Hear from our community members about their experiences."
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="h-full p-8 relative">
                <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10 dark:text-primary-light/10" />
                
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>

                <p className="text-muted-foreground  italic mb-8 relative z-10">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-slate-200  flex items-center justify-center font-bold text-muted-foreground">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground  text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
