import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import { SkeletonTableRows } from '../../components/Skeleton';
import { API_URL } from '../../config';
import { getAdmin } from '../../utils/adminAuth';

const EMPTY_ADD = { email: '', password: '' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' });
}

export default function AdminAdmins() {
  const admin = getAdmin();
  const [admins, setAdmins] = useState([]);
  const [loadState, setLoadState] = useState({ status: 'loading', error: '' });

  const [addForm, setAddForm] = useState(EMPTY_ADD);
  const [addError, setAddError] = useState('');
  const [addDone, setAddDone] = useState('');
  const [adding, setAdding] = useState(false);

  const [pwId, setPwId] = useState(null); // id of the admin whose password field is open
  const [pwValue, setPwValue] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const [rowError, setRowError] = useState('');

  const authHeaders = admin ? { Authorization: `Bearer ${admin.token}` } : {};

  const load = async () => {
    setLoadState({ status: 'loading', error: '' });
    try {
      const res = await fetch(`${API_URL}/admin/admins`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load admins');
      setAdmins(data.admins);
      setLoadState({ status: 'ready', error: '' });
    } catch (err) {
      setLoadState({ status: 'error', error: err.message });
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onAdd = async (e) => {
    e.preventDefault();
    if (!addForm.email.trim()) {
      setAddError('Email is required');
      return;
    }
    if (addForm.password.length < 6) {
      setAddError('Password must be at least 6 characters');
      return;
    }
    setAddError('');
    setAddDone('');
    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not add admin');
      setAddDone(`Added "${addForm.email}".`);
      setAddForm(EMPTY_ADD);
      load();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const openPasswordField = (id) => {
    setPwId(id);
    setPwValue('');
    setPwError('');
  };

  const cancelPassword = () => {
    setPwId(null);
    setPwValue('');
    setPwError('');
  };

  const onSavePassword = async (id) => {
    if (pwValue.length < 6) {
      setPwError('Password must be at least 6 characters');
      return;
    }
    setPwError('');
    setPwSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/admins/${id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ password: pwValue }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not update password');
      cancelPassword();
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  const onDelete = async (a) => {
    if (!window.confirm(`Delete admin "${a.email}"? This can't be undone.`)) return;
    setRowError('');
    try {
      const res = await fetch(`${API_URL}/admin/admins/${a.id}`, { method: 'DELETE', headers: authHeaders });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not delete admin');
      load();
    } catch (err) {
      setRowError(err.message);
    }
  };

  return (
    <>
      <Seo title="Admins | WebOnspark Technologies" description="Manage admin accounts." path="/admin/admins" noindex />
      <AdminLayout title="Admins">
        <Form noValidate onSubmit={onAdd} className="mb-5">
          <h2 className="h6">Add an admin</h2>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </Col>
            <Col md={4}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={addForm.password}
                onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </Col>
            <Col md={4}>
              <button type="submit" className="btn btn-brand w-100" disabled={adding}>
                {adding ? 'Adding…' : 'Add admin'}
              </button>
            </Col>
          </Row>
          {addError && <div className="form-error mt-3" role="alert">{addError}</div>}
          {addDone && <div className="text-success mt-3">{addDone}</div>}
        </Form>

        <h2 className="h6">Existing admins</h2>
        {loadState.status === 'error' && <div className="form-error" role="alert">{loadState.error}</div>}
        {rowError && <div className="form-error mb-3" role="alert">{rowError}</div>}
        {(loadState.status === 'loading' || loadState.status === 'ready') && (
          <div className="table-responsive admin-table-wrap">
            <Table className="align-middle admin-table mb-0">
              <thead><tr><th>Sl. No</th><th>Email</th><th>Added</th><th>Password</th><th></th></tr></thead>
              {loadState.status === 'loading' ? <tbody><SkeletonTableRows cols={5} /></tbody> : (
              <tbody>
                {admins.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{a.email}{admin?.email === a.email && <span className="text-muted"> (you)</span>}</td>
                    <td className="text-nowrap">{formatDate(a.created_at)}</td>
                    <td style={{ minWidth: 220 }}>
                      {pwId === a.id ? (
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex gap-2">
                            <Form.Control
                              type="password"
                              size="sm"
                              placeholder="New password"
                              value={pwValue}
                              onChange={(e) => setPwValue(e.target.value)}
                              autoFocus
                            />
                            <button type="button" className="btn btn-sm btn-brand text-nowrap" disabled={pwSaving} onClick={() => onSavePassword(a.id)}>
                              {pwSaving ? 'Saving…' : 'Save'}
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-brand" onClick={cancelPassword}>Cancel</button>
                          </div>
                          {pwError && <div className="text-danger small">{pwError}</div>}
                        </div>
                      ) : (
                        <button type="button" className="btn btn-sm btn-outline-brand" onClick={() => openPasswordField(a.id)}>
                          Change password
                        </button>
                      )}
                    </td>
                    <td className="text-nowrap">
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(a)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              )}
            </Table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
