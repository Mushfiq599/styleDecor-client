import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import { TbCurrencyTaka } from "react-icons/tb"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import useAuth from "../../../hooks/useAuth"
import { HiPlus, HiPencil, HiTrash, HiCheck } from "react-icons/hi"
import Modal from "../../../components/ui/Modal"
import Badge from "../../../components/ui/Badge"
import Pagination from "../../../components/ui/Pagination"

const categories = ["home","wedding","office","seminar","meeting","birthday"]

const emptyForm = {
  service_name: "", cost: "", unit: "",
  service_category: "home", description: "",
  images: ["", "", "", ""],
}

const ITEMS_PER_PAGE = 10

const ManageServices = () => {
  const { user, tokenReady } = useAuth()
  const axiosSecure   = useAxiosSecure()
  const [services, setServices]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData]       = useState(emptyForm)
  const [errors, setErrors]           = useState({})
  const [saving, setSaving]           = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchServices = async () => {
    try {
      const res = await axiosSecure.get("/services")
      setServices(res.data)
    } catch {
      toast.error("Failed to load services!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (!tokenReady) return; fetchServices() }, [tokenReady])

  const openAdd = () => {
    setEditingService(null)
    setFormData(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (service) => {
    setEditingService(service)
    // Pad/trim to exactly 4 slots so the 4 inputs always have a value to bind to.
    const existingImages = service.images && service.images.length > 0
      ? service.images
      : [service.image || ""]
    const images = [0, 1, 2, 3].map((i) => existingImages[i] || "")
    setFormData({
      service_name:     service.service_name,
      cost:             service.cost,
      unit:             service.unit,
      service_category: service.service_category,
      description:      service.description,
      images,
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleImageChange = (index, value) => {
    const images = [...formData.images]
    images[index] = value
    setFormData({ ...formData, images })
  }

  const validate = () => {
    const e = {}
    if (!formData.service_name.trim()) e.service_name = "Service name is required"
    if (!formData.cost || isNaN(formData.cost) || Number(formData.cost) <= 0) e.cost = "Enter a valid cost"
    if (!formData.unit.trim()) e.unit = "Unit is required"
    if (!formData.description.trim()) e.description = "Description is required"
    if (!formData.images[0]?.trim()) e.image_0 = "At least the first image is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      // Drop empty slots, keep whichever of the 4 were actually filled in.
      const images = formData.images.map((s) => s.trim()).filter(Boolean)
      const payload = {
        ...formData,
        images,
        image: images[0] || "", // cover image shown in cards/lists = first gallery image
        cost: Number(formData.cost),
        createdByEmail: user.email,
      }
      if (editingService) {
        await axiosSecure.put(`/services/${editingService._id}`, payload)
        toast.success("Service updated!")
      } else {
        await axiosSecure.post("/services", payload)
        toast.success("Service created!")
      }
      setModalOpen(false)
      setCurrentPage(1)
      fetchServices()
    } catch {
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
    if (!result.isConfirmed) return
    try {
      await axiosSecure.delete(`/services/${id}`)
      toast.success("Service deleted!")
      fetchServices()
    } catch {
      toast.error("Failed to delete!")
    }
  }

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE)
  const paginated  = services.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const field = (label, id, props) => (
    <div>
      <label htmlFor={id} className="font-body text-sm font-medium text-base-content mb-1.5 block">{label}</label>
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${errors[props.name || id] ? "border-red-500" : "border-transparent focus:border-primary"}`}
        {...props}
      />
      {errors[props.name || id] && <p className="font-body text-xs text-red-500 mt-1">{errors[props.name || id]}</p>}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-base-content">Manage Services</h2>
          <p className="font-body text-sm text-base-content/60 mt-1">Create, update and delete decoration services</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-body font-medium text-sm rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
        >
          <HiPlus size={18} />
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-base-300">
                    {["Service","Category","Cost","Unit","Actions"].map((h) => (
                      <th key={h} className={`text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((service, i) => (
                    <motion.tr
                      key={service._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={service.image} alt={service.service_name} loading="lazy" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          <div>
                            <p className="font-body font-semibold text-sm text-base-content">{service.service_name}</p>
                            <p className="font-body text-xs text-base-content/50 line-clamp-1 max-w-xs">{service.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="primary">{service.service_category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center font-heading font-bold text-primary">
                          <TbCurrencyTaka size={18} />{service.cost.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-base-content/60">{service.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(service)}
                            className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200"
                            aria-label="Edit service"
                          >
                            <HiPencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200"
                            aria-label="Delete service"
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

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {/* ── Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setErrors({}) }}
        title={editingService ? "Edit Service" : "Add New Service"}
        subtitle={editingService ? "Update the service details" : "Fill in the details to create a new service"}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {field("Service Name", "svc-name", {
            type: "text", name: "service_name",
            value: formData.service_name,
            onChange: (e) => setFormData({ ...formData, service_name: e.target.value }),
            placeholder: "e.g. Wedding Ceremony Setup",
          })}

          <div className="grid grid-cols-2 gap-3">
            {field("Cost (BDT)", "svc-cost", {
              type: "number", name: "cost",
              value: formData.cost,
              onChange: (e) => setFormData({ ...formData, cost: e.target.value }),
              placeholder: "e.g. 5000",
            })}
            {field("Unit", "svc-unit", {
              type: "text", name: "unit",
              value: formData.unit,
              onChange: (e) => setFormData({ ...formData, unit: e.target.value }),
              placeholder: "e.g. per room",
            })}
          </div>

          <div>
            <label htmlFor="svc-category" className="font-body text-sm font-medium text-base-content mb-1.5 block">Category</label>
            <select
              id="svc-category"
              value={formData.service_category}
              onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-base-200 border-2 border-transparent focus:border-primary outline-none font-body text-sm text-base-content transition-all duration-300"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-body text-sm font-medium text-base-content mb-1.5 block">
              Gallery Images (4)
            </label>
            <div className="flex flex-col gap-2">
              {formData.images.map((url, i) => (
                <div key={i}>
                  <input
                    id={`svc-image-${i}`}
                    type="url"
                    value={url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    placeholder={
                      i === 0
                        ? "https://images.unsplash.com/... (cover image, required)"
                        : `https://images.unsplash.com/... (image ${i + 1}, optional)`
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 ${
                      i === 0 && errors.image_0 ? "border-red-500" : "border-transparent focus:border-primary"
                    }`}
                  />
                  {i === 0 && errors.image_0 && (
                    <p className="font-body text-xs text-red-500 mt-1">{errors.image_0}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="svc-desc" className="font-body text-sm font-medium text-base-content mb-1.5 block">Description</label>
            <textarea
              id="svc-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the service..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 outline-none font-body text-sm text-base-content placeholder:text-base-content/30 transition-all duration-300 resize-none ${errors.description ? "border-red-500" : "border-transparent focus:border-primary"}`}
            />
            {errors.description && <p className="font-body text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-60 mt-2"
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <><HiCheck size={18} />{editingService ? "Save Changes" : "Create Service"}</>
            )}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default ManageServices