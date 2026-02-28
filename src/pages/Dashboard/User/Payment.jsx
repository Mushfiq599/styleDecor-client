import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import { motion } from "framer-motion"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import useAuth from "../../../hooks/useAuth"
import toast from "react-hot-toast"

// Load stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// ── Card Element Styles ───────────────────────────────────
const cardElementOptions = {
    style: {
        base: {
            fontSize: "16px",
            fontFamily: "Inter, sans-serif",
            color: "#0F172A",
            "::placeholder": {
                color: "#94a3b8",
            },
        },
        invalid: {
            color: "#ef4444",
        },
    },
}

// ── Inner Payment Form Component ──────────────────────────
const CheckoutForm = ({ booking }) => {
    const stripe = useStripe()
    const elements = useElements()
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [clientSecret, setClientSecret] = useState("")
    const [processing, setProcessing] = useState(false)
    const [cardError, setCardError] = useState("")

    // Get payment intent from server
    useEffect(() => {
        const getClientSecret = async () => {
            try {
                const res = await axiosSecure.post(
                    "/payments/create-payment-intent",
                    { bookingId: booking._id }
                )
                setClientSecret(res.data.clientSecret)
            } catch (error) {
                toast.error("Failed to initialize payment!")
            }
        }
        if (booking?._id) getClientSecret()
    }, [booking])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!stripe || !elements || !clientSecret) return

        setProcessing(true)
        setCardError("")

        const card = elements.getElement(CardElement)

        try {
            // Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: user?.displayName,
                            email: user?.email,
                        },
                    },
                }
            )

            if (error) {
                setCardError(error.message)
                setProcessing(false)
                return
            }

            if (paymentIntent.status === "succeeded") {
                // Save payment confirmation to our server
                await axiosSecure.post("/payments/confirm", {
                    bookingId: booking._id,
                    transactionId: paymentIntent.id,
                })

                toast.success("Payment successful! 🎉")
                navigate("/dashboard/user/bookings")
            }
        } catch (error) {
            toast.error("Payment failed. Try again!")
            setProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Card Input */}
            <div>
                <label className="font-body text-sm font-medium text-base-content mb-2 block">
                    Card Details
                </label>
                <div className="px-4 py-4 rounded-xl bg-base-200 border-2 border-transparent focus-within:border-primary transition-all duration-300">
                    <CardElement options={cardElementOptions} />
                </div>
                {/* Card Error */}
                {cardError && (
                    <p className="font-body text-xs text-red-500 mt-2">
                        {cardError}
                    </p>
                )}
            </div>

            {/* Test Card Info */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="font-body text-xs font-semibold text-primary mb-2">
                    🧪 Test Card Details
                </p>
                <p className="font-body text-xs text-base-content/60">
                    Card Number: <span className="font-semibold text-base-content">4242 4242 4242 4242</span>
                </p>
                <p className="font-body text-xs text-base-content/60">
                    Expiry: <span className="font-semibold text-base-content">Any future date</span>
                </p>
                <p className="font-body text-xs text-base-content/60">
                    CVC: <span className="font-semibold text-base-content">Any 3 digits</span>
                </p>
            </div>

            {/* Pay Button */}
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-body font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {processing ? (
                    <>
                        <span className="loading loading-spinner loading-sm" />
                        Processing...
                    </>
                ) : (
                    <>
                        🔒 Pay ৳{booking?.serviceCost?.toLocaleString()}
                    </>
                )}
            </button>

        </form>
    )
}

// ── Main Payment Page Component ───────────────────────────
const Payment = () => {
    const { bookingId } = useParams()
    const axiosSecure = useAxiosSecure()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axiosSecure.get(`/bookings/${bookingId}`)
                setBooking(res.data)
            } catch (error) {
                toast.error("Booking not found!")
            } finally {
                setLoading(false)
            }
        }
        fetchBooking()
    }, [bookingId])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        )
    }

    if (!booking) return null

    return (
        <div className="max-w-lg mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-6">
                    <h2 className="font-heading text-2xl font-bold text-base-content">
                        Complete Payment
                    </h2>
                    <p className="font-body text-sm text-base-content/60 mt-1">
                        Secure payment powered by Stripe
                    </p>
                </div>

                {/* Booking Summary */}
                <div className="glass-card p-5 mb-6">
                    <h3 className="font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-4">
                        Order Summary
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={booking.serviceImage || "https://placehold.co/80"}
                            alt={booking.serviceName}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-heading font-semibold text-base text-base-content">
                                {booking.serviceName}
                            </p>
                            <p className="font-body text-xs text-base-content/60 mt-0.5">
                                📅 {booking.bookingDate} · 📍 {booking.location}
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-base-300 pt-4 flex items-center justify-between">
                        <span className="font-body text-sm text-base-content/60">
                            Total Amount
                        </span>
                        <span className="font-heading font-bold text-2xl text-primary">
                            ৳{booking.serviceCost?.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Payment Form wrapped in Stripe Elements */}
                <div className="glass-card p-6">
                    <h3 className="font-body text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-6">
                        Payment Details
                    </h3>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm booking={booking} />
                    </Elements>
                </div>

                {/* Security Note */}
                <p className="font-body text-xs text-center text-base-content/40 mt-4">
                    🔒 Your payment is secured by Stripe. We never store your card details.
                </p>

            </motion.div>
        </div>
    )
}

export default Payment