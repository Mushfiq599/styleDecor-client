import { HiChevronLeft, HiChevronRight } from "react-icons/hi"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  // Show at most 7 page buttons, with ellipsis logic for large sets
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-base-200 text-base-content/60 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
      >
        <HiChevronLeft size={16} />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center font-body text-sm text-base-content/40"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`w-9 h-9 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-base-200 text-base-content/60 hover:bg-base-300"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-base-200 text-base-content/60 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
      >
        <HiChevronRight size={16} />
      </button>
    </div>
  )
}

export default Pagination