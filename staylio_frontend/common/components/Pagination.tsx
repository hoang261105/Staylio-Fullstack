import React from "react";
import { Button } from "./ui/button";

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
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
      >
        ←
      </Button>

      {page > 2 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(0)}
            className="w-10 h-10 p-0 rounded-lg"
          >
            1
          </Button>
          <span className="text-muted-foreground px-2">...</span>
        </>
      )}

      {getPages().map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(p)}
          className="w-10 h-10 p-0 rounded-lg"
        >
          {p + 1}
        </Button>
      ))}

      {page < totalPages - 3 && (
        <>
          <span className="text-muted-foreground px-2">...</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(totalPages - 1)}
            className="w-10 h-10 p-0 rounded-lg"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page + 1)}
        disabled={page + 1 >= totalPages}
      >
        →
      </Button>
    </div>
  );
}