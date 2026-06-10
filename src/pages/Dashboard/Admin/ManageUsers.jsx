import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { HiSearch } from "react-icons/hi"
import { HiChevronUpDown } from "react-icons/hi2"
import Badge from "../../../components/ui/Badge"
import Pagination from "../../../components/ui/Pagination"

const roleBadge = { admin: "danger", decorator: "primary", user: "neutral" }
const ITEMS_PER_PAGE = 10

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure()
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortBy, setSortBy]         = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users")
      setUsers(res.data)
    } catch {
      toast.error("Failed to load users!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (email, newRole) => {
    const result = await Swal.fire({
      title: `Change role to "${newRole}"?`,
      text: "This will update the user's permissions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0D9488",
      cancelButtonColor: "#ef4444",
    })
    if (!result.isConfirmed) return
    try {
      await axiosSecure.patch(`/users/role/${email}`, { role: newRole })
      toast.success("Role updated!")
      fetchUsers()
    } catch {
      toast.error("Failed to update role!")
    }
  }

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase()
      return (
        (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
        (roleFilter === "all" || u.role === roleFilter)
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
      return (a.name || "").localeCompare(b.name || "")
    })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">Manage Users</h2>
        <p className="font-body text-sm text-base-content/60 mt-1">View and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search by name or email..."
            aria-label="Search users"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
          />
        </div>
        <select
          value={roleFilter}
          onChange={handleFilterChange(setRoleFilter)}
          aria-label="Filter by role"
          className="px-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="decorator">Decorator</option>
        </select>
        <div className="flex items-center gap-2">
          <HiChevronUpDown className="text-base-content/40 flex-shrink-0" size={16} />
          <select
            value={sortBy}
            onChange={handleFilterChange(setSortBy)}
            aria-label="Sort users"
            className="px-4 py-2.5 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="font-body text-sm text-base-content/50 mb-4">
          Showing <span className="font-semibold text-base-content">{paginated.length}</span> of{" "}
          <span className="font-semibold text-base-content">{filtered.length}</span> users
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-3">👥</span>
          <p className="font-body text-base-content/60">No users found</p>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-base-300">
                    {["User", "Email", "Role", "Joined", "Change Role"].map((h) => (
                      <th key={h} className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=0D9488&color=fff`}
                            alt={u.name}
                            loading="lazy"
                            className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                          />
                          <p className="font-body font-semibold text-sm text-base-content truncate max-w-[120px]">
                            {u.name || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-base-content/60">{u.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={roleBadge[u.role] || "neutral"}>{u.role || "user"}</Badge>
                      </td>
                      <td className="px-6 py-4 font-body text-xs text-base-content/50">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u.email, e.target.value)}
                          aria-label={`Change role for ${u.name}`}
                          className="px-3 py-1.5 rounded-lg bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-xs text-base-content transition-all duration-300 cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="decorator">Decorator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  )
}

export default ManageUsers