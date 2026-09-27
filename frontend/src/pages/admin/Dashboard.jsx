import { useEffect, useState } from "react";
import {
  BedDouble,
  DoorOpen,
  DoorClosed,
  Users,
  ClipboardList,
  CalendarClock,
  IndianRupee,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getOverview,
  getOccupancyTrend,
  getRevenueTrend,
  getBookingGrowth,
} from "../../api/dashboard";
import StatCard from "../../components/admin/StatCard";
import Loader from "../../components/common/Loader";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [occupancy, setOccupancy] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOverview(), getOccupancyTrend(), getRevenueTrend(), getBookingGrowth()])
      .then(([o, occ, rev, gro]) => {
        setOverview(o);
        setOccupancy(occ);
        setRevenue(rev);
        setGrowth(gro);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !overview) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Dashboard Overview</h1>
        <p className="text-ink/60 text-sm">Real-time snapshot of AMARA Ladies PG operations.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={BedDouble} label="Total Rooms" value={overview.total_rooms} />
        <StatCard icon={Users} label="Total Beds" value={overview.total_beds} />
        <StatCard icon={DoorClosed} label="Occupied Beds" value={overview.occupied_beds} accent="warning" />
        <StatCard icon={DoorOpen} label="Available Beds" value={overview.available_beds} accent="success" />
        <StatCard icon={CalendarClock} label="Pending Visits" value={overview.pending_visits} accent="warning" />
        <StatCard icon={ClipboardList} label="Pending Reservations" value={overview.pending_reservations} accent="warning" />
        <StatCard
          icon={IndianRupee}
          label="Monthly Revenue"
          value={`₹${overview.monthly_revenue.toLocaleString("en-IN")}`}
          accent="success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-ink mb-4">Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={occupancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
              <XAxis dataKey="month" stroke="#2C2C2C" fontSize={12} />
              <YAxis stroke="#2C2C2C" fontSize={12} unit="%" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="occupancy_rate"
                stroke="#6D4C41"
                fill="#6D4C41"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-ink mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
              <XAxis dataKey="month" stroke="#2C2C2C" fontSize={12} />
              <YAxis stroke="#2C2C2C" fontSize={12} />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
              <Bar dataKey="revenue" fill="#BCAAA4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold text-ink mb-4">Booking Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D7CCC8" />
              <XAxis dataKey="month" stroke="#2C2C2C" fontSize={12} />
              <YAxis stroke="#2C2C2C" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
