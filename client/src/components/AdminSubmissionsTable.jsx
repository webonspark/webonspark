import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { API_URL } from '../config';
import { getAdmin, adminLogout } from '../utils/adminAuth';

/** Fetches submissions of one form type and renders them as a table of payload fields. */
export default function AdminSubmissionsTable({ formType, columns, emptyText = 'Nothing here yet.' }) {
  const [state, setState] = useState({ status: 'loading', rows: [], error: '' });

  useEffect(() => {
    const admin = getAdmin();
    if (!admin) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/forms?formType=${formType}`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        if (res.status === 401) {
          adminLogout();
          if (!cancelled) setState({ status: 'error', rows: [], error: 'Your session expired. Please sign in again.' });
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load submissions');
        if (!cancelled) setState({ status: 'ready', rows: data.submissions, error: '' });
      } catch (err) {
        if (!cancelled) setState({ status: 'error', rows: [], error: err.message });
      }
    })();

    return () => { cancelled = true; };
  }, [formType]);

  if (state.status === 'loading') return <p className="text-muted">Loading…</p>;
  if (state.status === 'error') return <div className="form-error" role="alert">{state.error}</div>;
  if (state.rows.length === 0) return <p className="text-muted">{emptyText}</p>;

  return (
    <div className="table-responsive">
      <Table striped bordered hover size="sm" className="align-middle">
        <thead>
          <tr>
            <th>Sl. No</th>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {state.rows.map((row, i) => (
            <tr key={row.id}>
              <td>{i + 1}</td>
              {columns.map((c) => <td key={c.key}>{row.payload?.[c.key] || ''}</td>)}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
