import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getTenants } from "../../api/dashboard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenants()
      .then(setTenants)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Tenants</h1>
        <p className="text-ink/60 text-sm">All registered tenants and their reservation status.</p>
      </div>

      {loading ? (
        <Loader />
      ) : tenants.length === 0 ? (
        <EmptyState icon={Users} title="No tenants registered yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary text-left text-ink/50">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-secondary/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{tenant.name}</td>
                  <td className="px-5 py-3 text-ink/70">{tenant.email}</td>
                  <td className="px-5 py-3 text-ink/70">{tenant.phone}</td>
                  <td className="px-5 py-3 text-ink/70">{tenant.room_number || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={tenant.has_active_reservation ? "badge-success" : "badge-warning"}>
                      {tenant.has_active_reservation ? "Active Resident" : "No Active Booking"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
