import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-border">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-2">
            <Link href="#" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="bg-primary p-2 rounded-xl group-hover:bg-primary-light transition-colors">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Global <span className="text-primary">School</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Empowering minds and shaping the future through holistic education and modern infrastructure.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-primary-light transition-colors">Home</Link></li>
              <li><Link href="#about" className="hover:text-primary-light transition-colors">About Us</Link></li>
              <li><Link href="#facilities" className="hover:text-primary-light transition-colors">Facilities</Link></li>
              <li><Link href="#bus-service" className="hover:text-primary-light transition-colors">Bus Service</Link></li>
              <li><Link href="#academics" className="hover:text-primary-light transition-colors">Academics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-3">
              <li><Link href="#admissions" className="hover:text-primary-light transition-colors">Admissions</Link></li>
              <li><Link href="#" className="hover:text-primary-light transition-colors">Fee Structure</Link></li>
              <li><Link href="#" className="hover:text-primary-light transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary-light transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-primary-light transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary-light transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary-light transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Global School. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}
