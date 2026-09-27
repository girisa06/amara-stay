import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/90 mt-20">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center font-display font-semibold">
              A
            </div>
            <p className="font-display text-lg font-semibold">AMARA Stay</p>
          </div>
          <p className="text-sm text-white/70">
            AMARA Ladies PG offers safe, comfortable and fully equipped accommodation for
            students and working professionals in Chennai.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About PG</Link></li>
            <li><Link to="/rooms" className="hover:text-white">Rooms</Link></li>
            <li><Link to="/book-visit" className="hover:text-white">Book a Visit</Link></li>
            <li><Link to="/enquiry" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">For Tenants</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/my-bookings" className="hover:text-white">Track Booking</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">Contact</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              12th Cross Street, Adyar, Chennai, Tamil Nadu 600020
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" /> +91 90000 00000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" /> owner@amarastay.in
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} AMARA Stay. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
