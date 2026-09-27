import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BedDouble } from "lucide-react";
import { getRooms } from "../api/rooms";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilters from "../components/rooms/RoomFilters";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const EMPTY_FILTERS = { room_type: "", min_rent: "", max_rent: "", availability: "", sort: "" };

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    room_type: searchParams.get("room_type") || "",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const params = {};
    if (filters.room_type) params.room_type = filters.room_type;
    if (filters.min_rent) params.min_rent = filters.min_rent;
    if (filters.max_rent) params.max_rent = filters.max_rent;
    if (filters.availability) params.availability = filters.availability;
    if (filters.sort) params.sort = filters.sort;

    getRooms(params)
      .then((data) => {
        if (active) setRooms(data);
      })
      .catch(() => {
        if (active) setError("Unable to load rooms right now. Please try again shortly.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <div className="section container-page">
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">
          Our Rooms
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          Browse Available Rooms
        </h1>
      </div>

      <RoomFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {loading ? (
        <Loader label="Loading rooms..." />
      ) : error ? (
        <EmptyState icon={BedDouble} title="Something went wrong" description={error} />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No rooms match your filters"
          description="Try adjusting your filters or clearing them to see all available rooms."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
