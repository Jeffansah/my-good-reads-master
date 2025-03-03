import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Props interface for the Pagination component
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Calculate total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5; // Maximum number of page buttons to show

  // Calculate the range of page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Generate array of page numbers to display
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        data-testid="pagination-prev"
      >
        <ChevronLeft size={20} />
      </button>

      {/* First page and ellipsis if needed */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="pagination-page-button"
            data-testid="pagination-page-1"
          >
            1
          </button>
          {startPage > 2 && <span className="pagination-dots">...</span>}
        </>
      )}

      {/* Page number buttons */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-page-button ${
            currentPage === number ? "active" : ""
          }`}
          data-testid={`pagination-page-${number}`}
        >
          {number}
        </button>
      ))}

      {/* ellipses to show when there are more pages */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="pagination-dots">...</span>
          )}
        </>
      )}

      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`pagination-button ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        data-testid="pagination-next"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
