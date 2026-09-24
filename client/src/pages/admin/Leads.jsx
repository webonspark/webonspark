import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import { SkeletonTableRows } from '../../components/Skeleton';
import { API_URL } from '../../config';
import { getAdmin, adminLogout } from '../../utils/adminAuth';
import { usePagination } from '../../components/admin/usePagination';
import AdminPagination from '../../components/admin/AdminPagination';

const STATUSES = ['On Hold', 'Accepted', 'Rejected', 'Completed'];
const EMPTY_FORM = { name: '', phone: '', email: '', websiteType: '', leadOwner: '', project: '', status: 'On Hold' };

// Accepts common header spellings ("Website Type", "website_type", "Site Type" …) from a pasted-together CSV.
const HEADER_ALIASES = {
  name: 'name',
  phone: 'phone',
  mobile: 'phone',
  email: 'email',
  websitetype: 'websiteType',
  sitetype: 'websiteType',
  leadowner: 'leadOwner',
  owner: 'leadOwner',
  project: 'project',
  status: 'status',
};
const normaliseHeader = (h) => h.toLowerCase().replace(/[^a-z]/g, '');

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' });
}

export default function AdminLeads() {
  const admin = getAdmin();
  const fileInputRef = useRef(null);
  const [leads, setLeads] = useState([]);
  const [loadState, setLoadState] = useState({ status: 'loading', error: '' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [importState, setImportState] = useState({ status: 'idle', msg: '' });

  const authHeaders = admin ? { Authorization: `Bearer ${admin.token}` } : {};
  const { page, setPage, totalPages, pageItems } = usePagination(leads);
  const startIndex = (page - 1) * 20;

  const loadLeads = async () => {
    if (!admin) return;
    setLoadState({ status: 'loading', error: '' });
    try {
      const res = await fetch(`${API_URL}/leads`, { headers: authHeaders });
      if (res.status === 401) {
        adminLogout();
        setLoadState({ status: 'error', error: 'Your session expired. Please sign in again.' });
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load leads');
      setLeads(data.leads);
      setLoadState({ status: 'ready', error: '' });
    } catch (err) {
      setLoadState({ status: 'error', error: err.message });
    }
  };

  useEffect(() => { loadLeads(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not add lead');
      setForm(EMPTY_FORM);
      loadLeads();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onStatusChange = async (id, status) => {
    const previous = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const res = await fetch(`${API_URL}/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not update status');
    } catch {
      setLeads(previous);
    }
  };

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportState({ status: 'importing', msg: '' });
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data, errors }) => {
        if (errors.length) {
          setImportState({ status: 'error', msg: 'Could not read that CSV file.' });
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const rows = data.map((row) => {
          const mapped = {};
          Object.entries(row).forEach(([header, value]) => {
            const key = HEADER_ALIASES[normaliseHeader(header)];
            if (key) mapped[key] = typeof value === 'string' ? value.trim() : value;
          });
          return mapped;
        });

        try {
          const res = await fetch(`${API_URL}/leads/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ leads: rows }),
          });
          const result = await res.json();
          if (!res.ok || !result.ok) throw new Error(result.error || 'Import failed');
          setImportState({
            status: 'done',
            msg: `Imported ${result.inserted} lead${result.inserted === 1 ? '' : 's'}${result.skipped ? ` (${result.skipped} row${result.skipped === 1 ? '' : 's'} skipped — missing name)` : ''}.`,
          });
          loadLeads();
        } catch (err) {
          setImportState({ status: 'error', msg: err.message });
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
    });
  };

  return (
    <>
      <Seo title="Leads | WebOnspark Technologies" description="Manually tracked leads." path="/admin/leads" noindex />
      <AdminLayout title="Leads">
        <Form noValidate onSubmit={onAdd} className="mb-3">
          <Row className="g-3 align-items-end">
            <Col md={2}>
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={onChange} required />
            </Col>
            <Col md={2}>
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={form.phone} onChange={onChange} />
            </Col>
            <Col md={2}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={onChange} />
            </Col>
            <Col md={2}>
              <Form.Label>Website type</Form.Label>
              <Form.Control name="websiteType" value={form.websiteType} onChange={onChange} placeholder="e.g. Restaurant" />
            </Col>
            <Col md={2}>
              <Form.Label>Lead owner</Form.Label>
              <Form.Control name="leadOwner" value={form.leadOwner} onChange={onChange} />
            </Col>
            <Col md={2}>
              <Form.Label>Project</Form.Label>
              <Form.Control name="project" value={form.project} onChange={onChange} />
            </Col>
            <Col md={2}>
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={form.status} onChange={onChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <button type="submit" className="btn btn-brand w-100" disabled={saving}>
                {saving ? 'Adding…' : 'Add lead'}
              </button>
            </Col>
          </Row>
          {formError && <div className="form-error mt-2" role="alert">{formError}</div>}
        </Form>

        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
          <Form.Group controlId="lead-csv-import">
            <Form.Label className="mb-1">Or import a CSV</Form.Label>
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={onImportFile}
              disabled={importState.status === 'importing'}
            />
          </Form.Group>
          {importState.status === 'importing' && <span className="text-muted">Importing…</span>}
          {importState.status === 'done' && <span className="text-success">{importState.msg}</span>}
          {importState.status === 'error' && <span className="text-danger">{importState.msg}</span>}
        </div>
        <p className="text-muted small mt-n3 mb-4">
          Expected columns: Name, Phone, Email, Website Type, Lead Owner, Project, Status. Only Name is required.
        </p>

        {loadState.status === 'error' && <div className="form-error" role="alert">{loadState.error}</div>}
        {loadState.status === 'ready' && leads.length === 0 && <p className="text-muted">No leads yet.</p>}
        {(loadState.status === 'loading' || (loadState.status === 'ready' && leads.length > 0)) && (
          <>
            <div className="table-responsive admin-table-wrap">
              <Table className="align-middle admin-table mb-0">
                <thead>
                  <tr>
                    <th>Sl. No</th>
                    <th>Date added</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Website type</th>
                    <th>Lead owner</th>
                    <th>Project</th>
                    <th>Status</th>
                  </tr>
                </thead>
                {loadState.status === 'loading' ? <tbody><SkeletonTableRows cols={9} /></tbody> : (
                <tbody>
                  {pageItems.map((lead, i) => (
                    <tr key={lead.id}>
                      <td>{startIndex + i + 1}</td>
                      <td className="text-nowrap">{formatDate(lead.created_at)}</td>
                      <td>{lead.name}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.email}</td>
                      <td>{lead.website_type}</td>
                      <td>{lead.lead_owner}</td>
                      <td>{lead.project}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={lead.status}
                          onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
                )}
              </Table>
            </div>
            <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </AdminLayout>
    </>
  );
}
