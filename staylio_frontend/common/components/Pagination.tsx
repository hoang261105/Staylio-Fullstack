import React from "react";

interface Props {
  page: number; 
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages == 0) return null;

  const getPages = () => {
    const pages: number[] = [];

    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
      >
        ←
      </button>

      {page > 2 && (
        <>
          <button
            onClick={() => onChange(0)}
            className="px-3 py-1 border rounded-lg"
          >
            1
          </button>
          <span>...</span>
        </>
      )}

      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 border border-gray-300 rounded-lg ${
            p === page
              ? "bg-[#0066FF] text-white border-[#0066FF]"
              : "hover:bg-gray-100"
          }`}
        >
          {p + 1}
        </button>
      ))}

      {page < totalPages - 3 && (
        <>
          <span>...</span>
          <button
            onClick={() => onChange(totalPages - 1)}
            className="px-3 py-1 border border-gray-300 rounded-lg"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page + 1 >= totalPages}
        className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
      >
        →
      </button>
    </div>
  );
}