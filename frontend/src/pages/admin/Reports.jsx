import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getRooms } from "../../api/rooms";
import { getRevenueTrend } from "../../api/dashboard";
import Loader from "../../components/common/Loader";

export default function AdminReports() {
  const [rooms, setRooms] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRooms(), getRevenueTrend()])
      .then(([r, rev]) => {
        setRooms(r);
        setRevenue(rev);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const totalBeds = rooms.reduce((sum, r) => sum + r.total_beds, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + (r.total_beds - r.available_beds), 0);
  const occupancyRate = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const occupancyByType = ["single", "double", "triple", "four"].map((type) => {
    const typeRooms = rooms.filter((r) => r.room_type === type);
    const beds = typeRooms.reduce((sum, r) => sum + r.total_beds, 0);
    const occupied = typeRooms.reduce((sum, r) => sum + (r.total_beds - r.available_beds), 0);
    return { type, beds, occupied, rate: beds ? Math.round((occupied / beds) * 100) : 0 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Occupancy Reports</h1>
        <p className="text-ink/60 text-sm">Detailed breakdown of occupancy and revenue.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary font-display">{occupancyRate}%</p>
          <p className="text-xs text-ink/50 mt-1">Overall Occupancy</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-ink font-display">{occupiedBeds}</p>
          <p className="text-xs text-ink/50 mt-1">Beds Occupied</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-ink font-display">{totalBeds - occupiedBeds}</p>
          <p className="text-xs text-ink/50 mt-1">Beds Available</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Occupancy by Room Type</h3>
        <div className="space-y-4">
          {occupancyByType.map((item) => (
            <div key={item.type}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize text-ink/70">{item.type} Sharing</span>
                <span className="text-ink/50">
                  {item.occupied}/{item.beds} beds ({item.rate}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${item.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Revenue Trend (Confirmed Bookings)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
            <XAxis dataKey="month" stroke="#2C2C2C" fontSize={12} />
            <YAxis stroke="#2C2C2C" fontSize={12} />
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
            <Bar dataKey="revenue" fill="#6D4C41" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
