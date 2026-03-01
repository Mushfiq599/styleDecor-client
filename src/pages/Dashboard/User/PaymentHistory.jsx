import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import useAuth from "../../../hooks/useAuth"
import toast from "react-hot-toast"
import { HiCalendar, HiLocationMarker, HiReceiptTax } from "react-icons/hi"
import { CiCreditCard1 } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { CgNotes } from "react-icons/cg";
import { TbCurrencyTaka } from "react-icons/tb";

const PaymentHistory = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get(
          `/payments/history/${user?.email}`
        )
        setPayments(res.data)
      } catch (error) {
        toast.error("Failed to load payment history!")
      } finally {
        setLoading(false)
      }
    }
    if (user?.email) fetchPayments()
  }, [user])

  const totalSpent = payments.reduce(
    (sum, p) => sum + (p.serviceCost || 0), 0
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-base-content">
          Payment History
        </h2>
        <p className="font-body text-sm text-base-content/60 mt-1">
          All your past payments and receipts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Spent",
            value: `${totalSpent.toLocaleString()}`,
            icon: <TbCurrencyTaka />,
            color: "text-primary",
          },
          {
            label: "Total Payments",
            value: payments.length,
            icon: <CgNotes />,
            color: "text-blue-500",
          },
          {
            label: "Last Payment",
            value: payments[0]
              ? new Date(payments[0].createdAt).toLocaleDateString()
              : "N/A",
            icon: <SlCalender />,
            color: "text-secondary",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 text-center">
            <span className="text-3xl flex justify-center mb-2">{stat.icon}</span>
            <p className={`font-heading font-bold text-2xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="font-body text-xs text-base-content/60 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
      {payments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center justify-center items-center">
          <span className="text-6xl flex justify-center mb-4"><CiCreditCard1 color="#0D9488"/></span>
          <h3 className="font-heading text-xl font-semibold text-base-content mb-2">
            No payments yet
          </h3>
          <p className="font-body text-sm text-base-content/60">
            Your payment receipts will appear here after you pay for a booking.
          </p>
        </motion.div>
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
                    Date
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, i) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-base-300 last:border-0 hover:bg-base-200/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={payment.serviceImage || "https://placehold.co/48"}
                          alt={payment.serviceName}
                          className="w-10 h-10 rounded-lg object-cover"/>
                        <div>
                          <p className="font-body font-medium text-sm text-base-content">
                            {payment.serviceName}
                          </p>
                          <p className="flex items-center gap-1 font-body text-xs text-base-content/50">
                            <HiLocationMarker size={16} color="red"/>
                            {payment.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-body text-sm text-base-content/60">
                        <HiCalendar size={14} />
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-body text-xs text-base-content/60 font-mono">
                        <HiReceiptTax size={14} className="text-primary flex-shrink-0" />
                        <span className="truncate max-w-[120px]">
                          {payment.transactionId || "N/A"}
                        </span>
                      </span>
                    </td>
                    <td className="flex gap-1 items-center px-6 py-4 font-heading font-bold text-primary">
                      <TbCurrencyTaka size={20}/>{payment.serviceCost?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-body font-medium bg-green-500/10 text-green-500">
                          Paid
                      </span>
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

export default PaymentHistory