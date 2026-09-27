import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BedDouble } from "lucide-react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../api/rooms";
import AvailabilityBadge from "../../components/common/AvailabilityBadge";
import RoomFormModal from "../../components/admin/RoomFormModal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalRoom, setModalRoom] = useState(undefined);
  const [deletingId, setDeletingId] = useState(null);

  const loadRooms = () => {
    setLoading(true);
    getRooms()
      .then(setRooms)
      .finally(() => setLoading(false));
  };

  useEffect(loadRooms, []);

  const handleSubmit = async (payload) => {
    if (modalRoom?.id) {
      await updateRoom(modalRoom.id, payload);
    } else {
      await createRoom(payload);
    }
    setModalRoom(undefined);
    loadRooms();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteRoom(id);
      loadRooms();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">Room Management</h1>
          <p className="text-ink/60 text-sm">Add, edit and manage room availability.</p>
        </div>
        <button onClick={() => setModalRoom(null)} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Room
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : rooms.length === 0 ? (
        <EmptyState icon={BedDouble} title="No rooms yet" description="Add your first room to get started." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary text-left text-ink/50">
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Rent</th>
                <th className="px-5 py-3">Beds</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-secondary/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{room.room_number}</td>
                  <td className="px-5 py-3 capitalize text-ink/70">{room.room_type}</td>
                  <td className="px-5 py-3 text-ink/70">
                    ₹{Number(room.rent).toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-ink/70">
                    {room.available_beds}/{room.total_beds}
                  </td>
                  <td className="px-5 py-3">
                    <AvailabilityBadge status={room.availability_status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setModalRoom(room)}
                        className="p-2 rounded-lg hover:bg-secondary/50 text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        disabled={deletingId === room.id}
                        className="p-2 rounded-lg hover:bg-danger/10 text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalRoom !== undefined && (
        <RoomFormModal
          room={modalRoom}
          onClose={() => setModalRoom(undefined)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
