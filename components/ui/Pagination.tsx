"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ICONS } from "@/utils";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {

  const [page, setPage] = useState<number>(currentPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  }

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            className={`${page === i ? "" : "text-gray-400 text-sm"}`}
            key={i}
            onClick={() => handlePageChange(i)}
            aria-current={page === i ? "page" : undefined}>
            {i}
          </Button>
        )
      }
    } else {
      // Show first page
      pages.push(
        <Button key={1}
          onClick={() => handlePageChange(1)}
          aria-current={page === 1 ? "page" : undefined}>
          {1}
        </Button>
      );

      // Show ellipsis if needed
      if (page > 3) {
        pages.push(
          <span key={"ellipsis-1"} className="px-2 text-xs text-gray-500">
            ...
          </span>
        )
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <Button
              key={i}
              onClick={() => handlePageChange(i)}
              aria-current={page === i ? "page" : undefined}>
              {i}
            </Button>
          );
        }
      }

      if (page < totalPages - 2) {
        pages.push(
          <span key={"ellipsis-2"} className="px-2 text-xs text-gray-500">
            ...
          </span>
        )
      }

      pages.push(
        <Button key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          aria-current={page === totalPages ? "page" : undefined}>
          {totalPages}
        </Button>,
      );
    }
    return pages;
  }


  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous Page"
        className="transition-colors duration-200 ease-in-out enabled:hover:scale-105">
        <ICONS.left className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next Page"
        className="transition-colors duration-200 ease-in-out enabled:hover:scale-105"
      >
        <ICONS.right className="h-4 w-4" />
      </Button>
    </div>
  )
}
