import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IndianRupee, Maximize2, CalendarCheck, BedDouble, Phone } from "lucide-react";
import { getRoom } from "../api/rooms";
import RoomGallery from "../components/rooms/RoomGallery";
import AvailabilityBadge from "../components/common/AvailabilityBadge";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const ROOM_TYPE_LABELS = {
  single: "Single Sharing",
  double: "Double Sharing",
  triple: "Triple Sharing",
  four: "Four Sharing",
};

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getRoom(id)
      .then(setRoom)
      .catch(() => setError("Room not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading room details..." />;
  if (error || !room) {
    return <EmptyState icon={BedDouble} title="Room not found" description={error} />;
  }

  const isFull = room.availability_status === "fully_occupied";

  return (
    <div className="section container-page">
      <RoomGallery photos={room.photos} />

      <div className="grid lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <AvailabilityBadge status={room.availability_status} />
            <span className="text-sm text-ink/50">Room {room.room_number}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-4">
            {ROOM_TYPE_LABELS[room.room_type]}
          </h1>
          <p className="text-ink/70 leading-relaxed mb-6">{room.description}</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-4 text-center">
              <Maximize2 className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">{room.room_size || "N/A"}</p>
              <p className="text-xs text-ink/50">Room Size</p>
            </div>
            <div className="card p-4 text-center">
              <BedDouble className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">
                {room.available_beds}/{room.total_beds}
              </p>
              <p className="text-xs text-ink/50">Beds Available</p>
            </div>
            <div className="card p-4 text-center">
              <IndianRupee className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">₹{Number(room.rent).toLocaleString("en-IN")}</p>
              <p className="text-xs text-ink/50">Monthly Rent</p>
            </div>
          </div>

          {room.facilities?.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-ink mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((f) => (
                  <span key={f} className="badge bg-secondary/50 text-ink/70">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {room.food_plan && (
            <div className="mb-8">
              <h3 className="font-semibold text-ink mb-2">Food Plan</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{room.food_plan}</p>
            </div>
          )}

          {room.house_rules && (
            <div>
              <h3 className="font-semibold text-ink mb-2">House Rules</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{room.house_rules}</p>
            </div>
          )}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <p className="text-sm text-ink/50 mb-1">Monthly Rent</p>
            <p className="text-2xl font-bold text-primary mb-4">
              ₹{Number(room.rent).toLocaleString("en-IN")}
            </p>
            <div className="flex justify-between text-sm text-ink/60 mb-6 border-t border-secondary pt-4">
              <span>Security Deposit</span>
              <span className="font-medium text-ink">
                ₹{Number(room.deposit).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/book-visit" className="btn-outline w-full">
                <CalendarCheck className="h-4 w-4" /> Book Visit
              </Link>
              <Link
                to={isFull ? "#" : `/reserve-bed?room=${room.id}`}
                className={`btn-primary w-full ${isFull ? "opacity-50 pointer-events-none" : ""}`}
              >
                <BedDouble className="h-4 w-4" /> {isFull ? "Fully Occupied" : "Reserve Bed"}
              </Link>
              <a href="tel:+919000000000" className="btn-light w-full">
                <Phone className="h-4 w-4" /> Contact Owner
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
