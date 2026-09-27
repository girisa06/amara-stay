import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Star, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-success mb-5">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Ladies-Only PG
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-5">
            Find Your Perfect Stay at{" "}
            <span className="text-primary">AMARA Ladies PG</span>
          </h1>
          <p className="text-lg text-ink/70 mb-8 max-w-lg">
            Safe, comfortable and fully equipped accommodation for students and working
            professionals in Chennai.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/book-visit" className="btn-primary px-7 py-3.5 text-base">
              Book a Visit
            </Link>
            <Link to="/rooms" className="btn-outline px-7 py-3.5 text-base">
              Explore Rooms
            </Link>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-ink/60">4.8/5 resident rating</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink/60">
              <Users className="h-4 w-4 text-primary" /> 60+ residents housed
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="rounded-xl2 overflow-hidden shadow-cardHover aspect-[4/5] sm:aspect-[5/4]">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
              alt="AMARA Ladies PG common room"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden sm:block bg-white rounded-xl2 shadow-card p-4 w-48">
            <p className="text-2xl font-bold text-primary font-display">100%</p>
            <p className="text-xs text-ink/60">CCTV monitored premises</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
