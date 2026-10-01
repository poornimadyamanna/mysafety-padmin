import React from "react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // If small number of pages, show all
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      // Always show first page
      pages.push(1)

      // Show dots if needed
      if (page > 4) pages.push("...")

      // Show current window (page-2 to page+2)
      const start = Math.max(2, page - 2)
      const end = Math.min(totalPages - 1, page + 2)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Show dots if needed
      if (page < totalPages - 3) pages.push("...")

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getVisiblePages()

  return (
    <div className="flex justify-end items-center gap-2 pt-4">
      {/* Previous */}
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((pg, index) =>
          typeof pg === "number" ? (
            <Button
              key={pg}
              variant={pg === page ? "default" : "outline"}
              className="min-w-10"
              onClick={() => onPageChange(pg)}
            >
              {pg}
            </Button>
          ) : (
            <span
              key={`dots-${index}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          )
        )}
      </div>

      {/* Next */}
      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination;
