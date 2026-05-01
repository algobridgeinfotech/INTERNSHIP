import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Facilities } from "@/components/sections/Facilities"
import { BusService } from "@/components/sections/BusService"
import { Academics } from "@/components/sections/Academics"
import { Achievements } from "@/components/sections/Achievements"
import { EventsNotice } from "@/components/sections/EventsNotice"
import { Gallery } from "@/components/sections/Gallery"
import { Testimonials } from "@/components/sections/Testimonials"
import { Admission } from "@/components/sections/Admission"
import { Contact } from "@/components/sections/Contact"

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Facilities />
      <BusService />
      <Academics />
      <Achievements />
      <EventsNotice />
      <Gallery />
      <Testimonials />
      <Admission />
      <Contact />
    </>
  )
}
