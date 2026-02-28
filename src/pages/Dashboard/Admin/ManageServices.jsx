import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import useAuth from "../../../hooks/useAuth"
import {
  HiPlus, HiPencil, HiTrash, HiX, HiCheck
} from "react-icons/hi"

const categories = ["home", "wedding", "office", "seminar", "meeting", "birthday"]

const emptyForm = {
  service_name: "",
  cost: "",
  unit: "",
  service_category: "home",
  description: "",
  image: "",
}

const ManageServices = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/services")
      setServices(res.data)
    } catch (error) {
      toast.error("Failed to load services!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const openAddModal = () => {
    setEditingService(null)
    setFormData(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setFormData({
      service_name: service.service_name,
      cost: service.cost,
      unit: service.unit,
      service_category: service.service_category,
      description: service.description,
      image: service.image,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingService) {
        // Update
        await axios.put(
          `http://localhost:5000/services/${editingService._id}`,
          { ...formData, createdByEmail: user.email }
        )
        toast.success("Service updated!")
      } else {
        // Create
        await axios.post("http://localhost:5000/services", {
          ...formData,
          createdByEmail: user.email,
        })
        toast.success("Service created!")
      }
      setModalOpen(false)
      fetchServices()
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Service?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#0D9488",
    })
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/services/${id}`)
        toast.success("Service deleted!")
        fetchServices()
      } catch (error) {
        toast.error("Failed to delete!")
      }
    }
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-base-content">
            Manage Services
          </h2>
          <p className="font-body text-sm text-base-content/60 mt-1">
            Create, update and delete decoration services
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
        >
          <HiPlus size={18} />
          Add Service
        </button>
      </div>

      {/* ── Services Table ── */}
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
                    Service
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="text-right px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={service.image}
                          alt={service.service_name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-body font-semibold text-sm text-base-content">
                            {service.service_name}
                          </p>
                          <p className="font-body text-xs text-base-content/50 line-clamp-1 max-w-xs">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium capitalize">
                        {service.service_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-primary">
                      ৳{service.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-base-content/60">
                      {service.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200"
                        >
                          <HiPencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200"
                        >
                          <HiTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">

                {/* Close */}
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-base-200 flex items-center justify-center text-base-content/50 hover:text-base-content transition-colors"
                >
                  <HiX size={16} />
                </button>

                {/* Modal Header */}
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-bold text-base-content">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </h2>
                  <p className="font-body text-sm text-base-content/60 mt-1">
                    {editingService
                      ? "Update the service details"
                      : "Fill in the details to create a new service"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                  {/* Service Name */}
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={formData.service_name}
                      onChange={(e) =>
                        setFormData({ ...formData, service_name: e.target.value })
                      }
                      placeholder="e.g. Wedding Ceremony Setup"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
                    />
                  </div>

                  {/* Cost and Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                        Cost (BDT)
                      </label>
                      <input
                        type="number"
                        value={formData.cost}
                        onChange={(e) =>
                          setFormData({ ...formData, cost: e.target.value })
                        }
                        placeholder="e.g. 5000"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        placeholder="e.g. per room"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Category
                    </label>
                    <select
                      value={formData.service_category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service_category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the service..."
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 mt-2"
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <HiCheck size={18} />
                        {editingService ? "Save Changes" : "Create Service"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageServices