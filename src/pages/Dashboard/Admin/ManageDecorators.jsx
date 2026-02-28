import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { HiCheck, HiX, HiSearch } from "react-icons/hi"

const ManageDecorators = () => {
  const axiosSecure = useAxiosSecure()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users")
      setUsers(res.data)
    } catch (error) {
      toast.error("Failed to load users!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (email, newRole) => {
    const action = newRole === "decorator" ? "Make Decorator" : "Remove Decorator"
    const result = await Swal.fire({
      title: `${action}?`,
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0D9488",
      cancelButtonColor: "#6b7280",
    })
    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/role/${email}`, {
          role: newRole,
        })
        toast.success(`Role updated to ${newRole}!`)
        fetchUsers()
      } catch (error) {
        toast.error("Failed to update role!")
      }
    }
  }
  const getRoleBadge = (role) => {
    if (role === "admin") return "bg-secondary/10 text-secondary"
    if (role === "decorator") return "bg-primary/10 text-primary"
    return "bg-base-300 text-base-content/60"
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-base-content">
            Manage Decorators
          </h2>
          <p className="font-body text-sm text-base-content/60 mt-1">
            Assign or remove decorator roles from users
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <HiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 w-60"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="text-right px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.photo ||
                            `https://ui-avatars.com/api/?name=${u.name}&background=0D9488&color=fff`
                          }
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <p className="font-body font-medium text-sm text-base-content">
                          {u.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-base-content/60">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-body font-medium capitalize ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== "decorator" && u.role !== "admin" && (
                          <button
                            onClick={() => handleRoleChange(u.email, "decorator")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white font-body text-xs font-medium rounded-lg transition-all duration-200"
                          >
                            <HiCheck size={14} />
                            Make Decorator
                          </button>
                        )}
                        {u.role === "decorator" && (
                          <button
                            onClick={() => handleRoleChange(u.email, "user")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-body text-xs font-medium rounded-lg transition-all duration-200"
                          >
                            <HiX size={14} />
                            Remove Decorator
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageDecorators