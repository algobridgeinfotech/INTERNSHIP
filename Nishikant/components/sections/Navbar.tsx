"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"

const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#about" },
  { name: "Academics", href: "#academics" },
  { name: "Facilities", href: "#facilities" },
  { name: "Admissions", href: "#admissions" },
  { name: "Student Life", href: "#student-life" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-12">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-10 h-12 ${isScrolled ? "text-[#008080]" : "text-white"}`}>
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-xl md:text-2xl leading-none tracking-tight ${isScrolled ? "text-gray-700" : "text-white"}`}>
                GLOBAL SCHOOL
              </span>
              <span className={`text-[10px] md:text-xs tracking-wider mt-1 ${isScrolled ? "text-gray-500" : "text-gray-200"}`}>
                Nurturing Minds, Shaping Futures
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-green-500 ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {link.name} {(link.name === "About Us" || link.name === "Academics") && <ChevronDown className="inline h-3 w-3 ml-1 opacity-70" />}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="#apply"
              className="bg-[#84cc16] hover:bg-[#65a30d] text-white px-6 py-2.5 rounded text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              Apply Now &rarr;
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden p-2 ${isScrolled ? "text-gray-900" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-xl absolute top-full left-0 right-0 border-t border-gray-100">
          <ul className="flex flex-col px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className="block text-base font-medium text-gray-800 hover:text-[#65a30d] py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="#apply"
                className="block w-full text-center bg-[#84cc16] hover:bg-[#65a30d] text-white px-5 py-3 rounded text-base font-semibold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
