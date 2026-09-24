import { useState } from 'react';

/** Slices a list into pages of `pageSize` (default 20). Resets to page 1 whenever the list shrinks below the current page. */
export function usePagination(items, pageSize = 20) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice((safePage - 1) * pageSize, safePage * pageSize);
  return { page: safePage, setPage, totalPages, pageItems, pageSize };
}
