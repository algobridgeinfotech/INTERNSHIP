"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"

const IMAGES = [
  { id: 1, src: "/images/gallery-science.png", title: "Science Exhibition", colSpan: "md:col-span-2", rowSpan: "md:row-span-2" },
  { id: 2, src: "/images/gallery-sports.png", title: "Sports Day", colSpan: "col-span-1", rowSpan: "row-span-1" },
  { id: 3, src: "/images/gallery-annual.png", title: "Annual Function", colSpan: "col-span-1", rowSpan: "row-span-1" },
  { id: 4, src: "/images/gallery-library.png", title: "Library Reading", colSpan: "md:col-span-2", rowSpan: "row-span-1" },
  { id: 5, src: "/images/gallery-art.png", title: "Art Class", colSpan: "col-span-1", rowSpan: "row-span-1" },
]

export function Gallery() {
  return (
    <section className="py-24 relative bg-secondary ">
      <div className="container px-4 md:px-6">
        <SectionHeading 
          title="Campus Life in Pictures" 
          subtitle="Explore the vibrant student life, events, and modern infrastructure of Global School."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[150px] md:auto-rows-[200px]">
          {IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group bg-slate-200  ${img.colSpan} ${img.rowSpan}`}
            >
              <Image 
                src={img.src} 
                alt={img.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/60 transition-all duration-300 flex flex-col justify-end p-6 z-10">
                <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h4 className="text-white font-bold text-lg">{img.title}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
