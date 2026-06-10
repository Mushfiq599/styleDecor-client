const variants = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-green-500/10 text-green-500",
  warning: "bg-yellow-500/10 text-yellow-500",
  danger: "bg-red-500/10 text-red-500",
  info: "bg-blue-500/10 text-blue-500",
  neutral: "bg-base-300 text-base-content/60",
}

const Badge = ({ children, variant = "primary", className = "" }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-3 py-1 rounded-full
        font-body text-xs font-medium capitalize
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge