import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { SkeletonLine } from '../Skeleton';
import { API_URL } from '../../config';
import { getAdmin, adminLogout } from '../../utils/adminAuth';
import { usePagination } from './usePagination';
import AdminPagination from './AdminPagination';

/**
 * Fetches submissions and renders them as a table of payload fields.
 * Pass `formType` for a single type, or `formTypes` (array) to combine several
 * into one list (sorted newest-first) — a "Type" column is shown automatically
 * when combining, so rows from different forms stay distinguishable.
 * A column's `key` can be a string (reads row.payload[key]) or a function
 * (payload) => value, for fields that live under different names per form type.
 */
export default function AdminSubmissionsTable({ formType, formTypes, columns, emptyText = 'Nothing here yet.' }) {
  const [state, setState] = useState({ status: 'loading', rows: [], error: '' });
  const types = formTypes || [formType];
  const showTypeColumn = types.length > 1;

  useEffect(() => {
    const admin = getAdmin();
    if (!admin) return;

    let cancelled = false;
    (async () => {
      try {
        const responses = await Promise.all(
          types.map((t) => fetch(`${API_URL}/forms?formType=${t}`, { headers: { Authorization: `Bearer ${admin.token}` } }))
        );
        if (responses.some((r) => r.status === 401)) {
          adminLogout();
          if (!cancelled) setState({ status: 'error', rows: [], error: 'Your session expired. Please sign in again.' });
          return;
        }
        const bodies = await Promise.all(responses.map((r) => r.json()));
        const bad = bodies.find((b) => !b.ok);
        if (bad) throw new Error(bad.error || 'Failed to load submissions');
        const rows = bodies.flatMap((b) => b.submissions).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (!cancelled) setState({ status: 'ready', rows, error: '' });
      } catch (err) {
        if (!cancelled) setState({ status: 'error', rows: [], error: err.message });
      }
    })();

    return () => { cancelled = true; };
  }, [JSON.stringify(types)]); // eslint-disable-line react-hooks/exhaustive-deps

  const { page, setPage, totalPages, pageItems } = usePagination(state.rows);
  const startIndex = (page - 1) * 20;

  if (state.status === 'error') return <div className="form-error" role="alert">{state.error}</div>;
  if (state.status === 'ready' && state.rows.length === 0) return <p className="text-muted">{emptyText}</p>;

  const colCount = columns.length + (showTypeColumn ? 1 : 0);

  return (
    <>
      <div className="table-responsive admin-table-wrap">
        <Table className="align-middle admin-table mb-0">
          <thead>
            <tr>
              <th>Sl. No</th>
              {showTypeColumn && <th>Type</th>}
              {columns.map((c) => <th key={c.label}>{c.label}</th>)}
            </tr>
          </thead>
          {state.status === 'loading' ? (
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><SkeletonLine width={16} /></td>
                  {Array.from({ length: colCount }).map((__, j) => <td key={j}><SkeletonLine width="80%" /></td>)}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {pageItems.map((row, i) => (
                <tr key={row.id}>
                  <td>{startIndex + i + 1}</td>
                  {showTypeColumn && <td>{row.form_type}</td>}
                  {columns.map((c) => (
                    <td key={c.label}>{typeof c.key === 'function' ? c.key(row.payload) : (row.payload?.[c.key] || '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
      <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
