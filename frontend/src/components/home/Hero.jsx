import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Wifi } from "lucide-react";
import { IMAGES } from "../../constants/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
            Find Your Perfect Stay at{" "}
            <span className="text-primary">AMARA Ladies PG</span>
          </h1>
          <p className="text-lg text-ink/70 mb-8 max-w-lg">
            Safe, comfortable and fully equipped accommodation for students and working
            professionals.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/book-visit" className="btn-primary px-7 py-3.5 text-base">
              Book a Visit
            </Link>
            <Link to="/rooms" className="btn-outline px-7 py-3.5 text-base">
              Explore Rooms
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-ink/70">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-primary" /> 3 meals complimentary
            </span>
            <span className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" /> High-speed Wi-Fi
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="rounded-xl2 overflow-hidden shadow-cardHover max-w-sm w-full">
            <img
              src={IMAGES.building}
              alt="AMARA Ladies PG building"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
