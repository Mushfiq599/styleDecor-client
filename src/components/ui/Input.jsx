import { forwardRef } from "react"

const Input = forwardRef(
  (
    {
      label,
      id,
      error,
      hint,
      leftIcon: LeftIcon,
      rightElement,
      className = "",
      wrapperClassName = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-sm font-medium text-base-content"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <LeftIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
              size={16}
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full py-3 rounded-xl bg-base-200
              border-2 transition-all duration-300 outline-none
              font-body text-sm text-base-content placeholder:text-base-content/30
              focus:bg-base-100
              ${error
                ? "border-red-500 focus:border-red-500"
                : "border-transparent focus:border-primary"
              }
              ${LeftIcon ? "pl-11 pr-4" : "px-4"}
              ${rightElement ? "pr-12" : ""}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="font-body text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="font-body text-xs text-base-content/50">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input