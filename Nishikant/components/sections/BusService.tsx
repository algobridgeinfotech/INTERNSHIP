"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { GlassCard } from "@/components/ui/GlassCard"
import {
  Bus,
  MapPin,
  Shield,
  Phone,
  Wifi,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

/* ─── Route Data ─────────────────────────────────── */
const BUS_ROUTES = [
  {
    route: "Route A",
    color: "bg-primary/5 border-primary/20",
    badge: "bg-primary",
    stops: ["City Centre", "Park Road", "Lake View", "Green Valley", "School Gate"],
    seats: 42,
  },
  {
    route: "Route B",
    color: "bg-accent/5 border-accent/20",
    badge: "bg-accent",
    stops: ["Rail Nagar", "Sunflower Colony", "Metro Plaza", "Airport Road", "School Gate"],
    seats: 38,
  },
  {
    route: "Route C",
    color: "bg-secondary/5 border-secondary/20",
    badge: "bg-secondary-foreground",
    stops: ["Old Town", "Civil Lines", "Sector 12", "Hill View", "School Gate"],
    seats: 40,
  },
  {
    route: "Route D",
    color: "bg-accent/10 border-accent/30",
    badge: "bg-accent",
    stops: ["Riverside", "Orchid Park", "Krishna Nagar", "Tech Hub", "School Gate"],
    seats: 44,
  },
]

/* ─── Features ───────────────────────────────────── */
const FEATURES = [
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "GPS Tracked",
    desc: "Every bus is equipped with real-time GPS tracking.",
    bg: "bg-primary/10",
  },
  {
    icon: <Shield className="h-6 w-6 text-success" />,
    title: "Trained Drivers",
    desc: "All drivers are verified and safety-trained.",
    bg: "bg-success/10",
  },
  {
    icon: <Wifi className="h-6 w-6 text-accent" />,
    title: "Parent App",
    desc: "Live bus tracking via mobile app.",
    bg: "bg-accent/10",
  },
  {
    icon: <AlertCircle className="h-6 w-6 text-primary" />,
    title: "Emergency Support",
    desc: "Dedicated helpline support available.",
    bg: "bg-primary/10",
  },
]

/* ─── Animations ─────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

/* ─── Component ─────────────────────────────────── */
export function BusService() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">

      <div className="container px-4 md:px-6">

        <SectionHeading
          title="School Bus Service"
          subtitle="Safe, reliable, and GPS-monitored transportation."
        />

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative w-full rounded-3xl overflow-hidden mb-16 shadow-2xl"
        >
          <Image
            src="/images/bus.png"
            alt="School bus"
            width={1400}
            height={600}
            className="w-full object-cover"
          />
        </motion.div>

        {/* Features */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {FEATURES.map((f, i) => (
            <motion.div key={i} variants={item}>
              <GlassCard className="p-6">
                <div className={`w-12 h-12 flex items-center justify-center mb-4 ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Routes */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16"
        >
          {BUS_ROUTES.map((r, i) => (
            <motion.div key={i} variants={item}>
              <div className={`rounded-2xl border p-6 ${r.color}`}>
                <span className="text-xs font-bold">{r.route}</span>

                <ul className="mt-4 space-y-2">
                  {r.stops.map((stop, si) => (
                    <li key={si} className="flex gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {stop}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-sm text-muted-foreground">
                  Capacity: {r.seats}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🔥 FIXED BUTTON SECTION */}
        <GlassCard className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <h3 className="text-xl font-bold mb-2">Transport Enquiry</h3>
            <p className="text-muted-foreground">
              Contact us for transport-related queries.
            </p>
          </div>

          <div className="flex gap-4">

            {/* Primary Button */}
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400">
              Call Transport Office
            </button>

            {/* ✅ FIXED BUTTON */}
            <button className="px-6 py-3 bg-white text-gray-800 rounded-lg shadow-md border border-gray-300 hover:bg-gray-100 hover:text-black transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400">
              Send Enquiry
            </button>

          </div>
        </GlassCard>

      </div>
    </section>
  )
}