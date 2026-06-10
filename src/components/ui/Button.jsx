import { forwardRef } from "react"

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5",
  secondary:
    "bg-secondary text-white hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5",
  ghost: "bg-transparent text-base-content hover:bg-base-200",
  danger: "bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5",
}

const sizes = {
  sm: "px-4 py-2 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-4 text-sm rounded-2xl",
}

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          font-body font-semibold
          transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
export default Button