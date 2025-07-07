import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null); // null = loading, [] = empty

  const [adminId, setAdminId] = useState(null);

  // 🔐 Decode token to get admin's user ID
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminId(decoded.id || decoded._id);
      } catch (err) {
        console.error("Failed to decode token", err);
        toast.error("Invalid token");
      }
    }
  }, [token]);

  // 📊 Fetch stats + users
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get("http://localhost:8000/api/admin/stats", { headers }),
      axios.get("http://localhost:8000/api/admin/users", { headers }),
    ])
      .then(([s, u]) => {
        setStats(s.data);
        setUsers(u.data);
      })
      .catch(() => toast.error("Failed to load admin data"));
  }, [token]);

  const blockUser = (id) => {
    axios
      .patch(`http://localhost:8000/api/admin/users/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("User blocked");
        setUsers((u) => u.map((x) => (x._id === id ? res.data : x)));
      })
      .catch(() => toast.error("Block failed"));
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete user permanently?")) return;
    axios
      .delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("User deleted");
        setUsers((u) => u.filter((x) => x._id !== id));
      })
      .catch(() => toast.error("Delete failed"));
  };

  if (!stats || users === null || !adminId) return <Loader />;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Uploads" value={stats.totalUploads} />
        <StatCard
          label="Top Chart"
          value={
            Object.entries(stats.mostUsedCharts)
              .sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
          }
        />
      </div>

      {/* Users */}
      <section className="bg-white border rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Manage Users</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u._id === adminId;
              return (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.isBlocked ? "Blocked" : "Active"}</td>
                  <td className="p-2 flex gap-2">
                    {!u.isBlocked && !isSelf && (
                      <button
                        onClick={() => blockUser(u._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Block
                      </button>
                    )}
                    {!isSelf && (
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    )}
                    {isSelf && (
                      <span className="text-gray-600 font-extrabold italic text-xs">You</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-2xl font-bold text-emerald-600">{value}</p>
  </div>
);

const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
  </div>
);
