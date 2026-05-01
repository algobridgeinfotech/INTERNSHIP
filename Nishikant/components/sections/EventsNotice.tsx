"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { Calendar, Link as LinkIcon, Bell } from "lucide-react"

const NOTICES = [
  { id: 1, title: "Submission of Examination Forms (Private)", date: "9-Sep-2025", type: "new" },
  { id: 2, title: "Datesheet for Term-I Examination (2025-2026)", date: "23-Aug-2025", type: "new" },
  { id: 3, title: "Social Science - Marking Scheme", date: "1-Aug-2025", type: "new" },
  { id: 4, title: "Social Science - Sample Question Paper", date: "1-Aug-2025", type: "new" },
  { id: 5, title: "Science - Marking Scheme", date: "1-Aug-2025", type: "new" },
  { id: 6, title: "Science - Sample Question Paper", date: "1-Aug-2025", type: "new" },
  { id: 7, title: "Maths Standard - Marking Scheme", date: "1-Aug-2025", type: "new" },
  { id: 8, title: "Maths Standard - Sample Question Paper", date: "1-Aug-2025", type: "regular" },
  { id: 9, title: "Inter-School Debate Competition Details", date: "25-Jul-2025", type: "regular" },
  { id: 10, title: "Sports Day Registration Open", date: "15-Jul-2025", type: "regular" },
]

export function EventsNotice() {
  return (
    <section id="notices" className="py-24 relative bg-white  border-t border-border ">
      <div className="container px-4 md:px-6">
        <SectionHeading 
          title="Campus Highlights & Updates" 
          subtitle="Stay informed with the latest happenings and important announcements at Global School."
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          
          {/* Main Event Image (Republic Day) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[600px] group"
          >
            <Image 
              src="/images/republic-day.png" 
              alt="Republic Day Celebration" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
                Featured Event
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Grand Republic Day Celebration</h3>
              <p className="text-muted-foreground max-w-2xl line-clamp-2">
                Our students showcased incredible spirit and patriotism during the 76th Republic Day celebrations. The event featured a grand parade, cultural performances, and the hoisting of the national flag.
              </p>
            </div>
          </motion.div>

          {/* Scrolling Notifications (Notice Board) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-border  bg-[#2b305b]" // Using a deep blue similar to the image
          >
            {/* Header */}
            <div className="bg-[#f0a500] text-white p-4 flex items-center gap-3">
              <LinkIcon className="h-6 w-6" />
              <h3 className="text-xl font-bold tracking-wide">Extra Circulars</h3>
            </div>

            {/* Scrolling Area */}
            {/* We use a CSS animation or simple overflow-y-auto. The prompt asks for a scrolling chart. We can use a continuous CSS marquee or just a nice styled scrollbar. Let's use custom scrollbar styling for manual scrolling + a marquee effect if desired, but user can scroll. */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#2b305b] to-transparent z-10 pointer-events-none"></div>
              
              <div className="animate-marquee-vertical hover:[animation-play-state:paused] flex flex-col gap-4 pt-2 pb-10">
                {NOTICES.map((notice, i) => (
                  <div key={`${notice.id}-${i}`} className="border-b border-slate-600/50 pb-4 last:border-0 group cursor-pointer">
                    <div className="flex items-start gap-2 mb-1">
                      {notice.type === "new" && (
                        <span className="inline-block bg-[#ff5e00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0 mt-1">
                          New
                        </span>
                      )}
                      <h4 className="text-white text-sm md:text-base font-medium group-hover:text-primary-light transition-colors leading-snug">
                        {notice.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#f0a500] text-xs font-semibold ml-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {notice.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e2243; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555c91; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #737ac2; 
        }
        
        @keyframes marqueeVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-vertical {
          /* Using infinite scroll animation */
          animation: marqueeVertical 20s linear infinite;
        }
      `}} />
    </section>
  )
}
