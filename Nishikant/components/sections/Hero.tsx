import Image from "next/image"
import { Play, BookOpen, Trophy, ShieldCheck, GraduationCap } from "lucide-react"
import Link from "next/link"

const FEATURES = [
  {
    icon: <GraduationCap className="h-8 w-8 text-[#008080]" />,
    title: "Experienced Faculty",
    desc: "Learn from dedicated and experienced educators."
  },
  {
    icon: <BookOpen className="h-8 w-8 text-[#008080]" />,
    title: "Quality Education",
    desc: "Modern teaching methods with global perspective."
  },
  {
    icon: <Trophy className="h-8 w-8 text-[#008080]" />,
    title: "Holistic Development",
    desc: "Focus on academics, sports, arts & life skills."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#008080]" />,
    title: "Safe & Secure Campus",
    desc: "A secure environment for every student to thrive."
  }
]

export function Hero() {
  return (
    <div className="relative bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-1.png"
            alt="Global School Campus Assembly"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        {/* Content */}
        <div className="container relative z-20 mx-auto px-4 md:px-6 h-full flex flex-col justify-center mt-12 md:mt-20">
          <div className="max-w-3xl">
            {/* Label */}
            <p className="text-[#84cc16] font-bold tracking-widest text-sm uppercase mb-4">
              WELCOME TO GLOBAL SCHOOL
            </p>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Inspiring Minds.<br />
              Building <span className="text-[#84cc16]">Futures.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-medium">
              A place where creativity meets excellence and students grow into tomorrow's leaders.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link 
                href="#explore"
                className="bg-[#84cc16] hover:bg-[#65a30d] text-white px-8 py-3.5 rounded text-base font-semibold transition-colors flex items-center justify-center w-full sm:w-auto"
              >
                Explore Our School &rarr;
              </Link>
              
              <Link 
                href="#tour"
                className="flex items-center gap-3 text-white font-semibold hover:text-[#84cc16] transition-colors px-4 py-2 w-full sm:w-auto justify-center sm:justify-start group"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full border-2 border-white/50 bg-transparent group-hover:border-[#84cc16] transition-colors">
                  <Play className="h-5 w-5 fill-white group-hover:fill-[#84cc16] transition-colors" />
                </div>
                Watch Campus Tour
              </Link>
            </div>
          </div>
          
          {/* Slider Dots (Optional decoration mirroring the provided image) */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex-col gap-3 hidden md:flex">
             <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
             <div className="w-2.5 h-2.5 rounded-full border-2 border-white/50"></div>
             <div className="w-2.5 h-2.5 rounded-full border-2 border-white/50"></div>
             <div className="w-2.5 h-2.5 rounded-full border-2 border-white/50"></div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <div className="relative z-30 container mx-auto px-4 mt-8 sm:mt-12 pb-16">
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
              <div className="h-14 w-14 rounded-full bg-[#f4fdec] flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
