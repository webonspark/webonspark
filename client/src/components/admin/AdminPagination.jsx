import BsPagination from 'react-bootstrap/Pagination';

/** Page-number nav for admin tables. Renders nothing when everything fits on one page. */
export default function AdminPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <BsPagination className="admin-pagination">
      <BsPagination.Prev disabled={page === 1} onClick={() => onChange(page - 1)} />
      {Array.from({ length: totalPages }).map((_, i) => (
        <BsPagination.Item key={i} active={i + 1 === page} onClick={() => onChange(i + 1)}>
          {i + 1}
        </BsPagination.Item>
      ))}
      <BsPagination.Next disabled={page === totalPages} onClick={() => onChange(page + 1)} />
    </BsPagination>
  );
}
