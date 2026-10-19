import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Maximize2, IndianRupee, ArrowRight } from "lucide-react";
import AvailabilityBadge from "../common/AvailabilityBadge";

const ROOM_TYPE_LABELS = {
  
  double: "2 Sharing",
  triple: "3 Sharing",
  four: "4 Sharing",
};

export default function RoomCard({ room, index = 0 }) {
  const cover = room.photos?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="card overflow-hidden group hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={room.room_number}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-ink/40">
            No Image
          </div>
        )}
        <div className="absolute top-[14px] left-[14px]">
          <AvailabilityBadge status={room.availability_status} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-ink">{ROOM_TYPE_LABELS[room.room_type]}</h3>
          <span className="text-xs text-ink/50">Room {room.room_number}</span>
        </div>

        <div className="flex items-center gap-1 text-primary font-semibold mb-1">
          <IndianRupee className="h-4 w-4" />
          {Number(room.rent).toLocaleString("en-IN")}
          <span className="text-xs text-ink/50 font-normal ml-1">/bed/month</span>
        </div>
        {Number(room.deposit) > 0 && (
          <p className="text-xs text-ink/50 mb-3">
            Deposit: ₹{Number(room.deposit).toLocaleString("en-IN")}
          </p>
        )}

        {room.room_size && (
          <div className="flex items-center gap-1.5 text-xs text-ink/60 mb-3">
            <Maximize2 className="h-3.5 w-3.5" /> {room.room_size}
          </div>
        )}

        {room.facilities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.facilities.slice(0, 3).map((f) => (
              <span key={f} className="text-[11px] bg-secondary/50 text-ink/70 rounded-full px-2.5 py-1">
                {f}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="text-[11px] text-ink/50 px-1 py-1">
                +{room.facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        <Link
          to={`/rooms/${room.id}`}
          className="btn-outline w-full text-sm py-2.5 group-hover:bg-primary group-hover:text-white"
        >
          View Details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
