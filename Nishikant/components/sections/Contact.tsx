"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { MapPin, Phone, Mail, Send } from "lucide-react"

export function Contact() {
  return (
    <section className="py-24 relative bg-secondary ">
      <div className="container px-4 md:px-6">
        <SectionHeading 
          title="Get In Touch" 
          subtitle="Have questions about admissions or facilities? We'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mt-12">
          
          {/* Contact Information & Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <GlassCard className="p-6 flex items-start gap-4" hoverLift={false}>
                <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-sky-600 dark:text-primary-light" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground  mb-2">Campus Location</h4>
                  <p className="text-muted-foreground  leading-relaxed text-sm">
                    123 Education Boulevard,<br />
                    Knowledge Park, New Delhi,<br />
                    India - 110001
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="p-6 flex items-start gap-4" hoverLift={false}>
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-emerald-600 dark:text-success" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground  mb-2">Contact</h4>
                  <p className="text-muted-foreground  mb-1 text-sm">Admissions: +91 98765 43210</p>
                  <p className="text-muted-foreground  text-sm">Email: info@globalschool.edu</p>
                </div>
              </GlassCard>
            </div>

            {/* Google Map */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-border ">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.0688997!3d28.527582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1705662300000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <form className="h-full flex flex-col bg-white  rounded-3xl p-8 shadow-xl border border-border ">
              <h3 className="text-2xl font-bold text-foreground  mb-6">Send us a Message</h3>
              
              <div className="space-y-4 flex-grow flex flex-col">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-foreground ">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300  bg-secondary  focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-foreground ">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300  bg-secondary  focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-foreground ">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-300  bg-secondary  focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-2 flex-grow flex flex-col">
                  <label className="text-sm font-medium text-secondary-foreground ">Message</label>
                  <textarea className="w-full flex-grow min-h-[120px] px-4 py-3 rounded-xl border border-slate-300  bg-secondary  focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow resize-none" placeholder="How can we help you?"></textarea>
                </div>
                
                <Button className="w-full mt-4" size="lg">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
