import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { CONTACT } from "../../constants/content";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/90 mt-20">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center font-display font-semibold">
              A
            </div>
            <p className="font-display text-lg font-semibold">AMARA Stay</p>
          </div>
          <p className="text-sm text-white/70 max-w-sm">
            AMARA Ladies PG. Comfort. Safety. Convenience.
          </p>
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
          <p className="font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-white/70">
            {CONTACT.phones.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:+91${p}`} className="hover:text-white">{p}</a>
              </li>
            ))}
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
