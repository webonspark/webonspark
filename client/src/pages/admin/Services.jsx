import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Icon from '../../components/Icons';
import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageDropzone from '../../components/admin/ImageDropzone';
import SkeletonImage from '../../components/SkeletonImage';
import { SkeletonLine, SkeletonBlock, SkeletonTableRows } from '../../components/Skeleton';
import { API_URL } from '../../config';
import { getAdmin } from '../../utils/adminAuth';

const CATEGORIES = [
  { key: 'app', label: 'App Development', icon: 'mobile' },
  { key: 'web', label: 'Website Development', icon: 'globe' },
];
const EMPTY_TPL_FORM = { name: '', image: '', url: '' };

export default function AdminServices() {
  const admin = getAdmin();
  const [services, setServices] = useState([]);
  const [loadState, setLoadState] = useState({ status: 'loading', error: '' });

  const [selectedCategory, setSelectedCategory] = useState(null); // null | 'app' | 'web'
  const [selectedSlug, setSelectedSlug] = useState(null);

  const [tplForm, setTplForm] = useState(EMPTY_TPL_FORM);
  const [editIndex, setEditIndex] = useState(null); // null = adding a new template; a number = editing that index
  const [tplError, setTplError] = useState('');
  const [tplSaving, setTplSaving] = useState(false);
  const [tplDone, setTplDone] = useState('');

  const authHeaders = admin ? { Authorization: `Bearer ${admin.token}` } : {};
  const servicesInCategory = services.filter((s) => s.category === selectedCategory);
  const selectedService = services.find((s) => s.slug === selectedSlug);
  const currentTemplates = selectedService?.templates || [];

  const load = async () => {
    setLoadState({ status: 'loading', error: '' });
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load services');
      setServices(data.services);
      setLoadState({ status: 'ready', error: '' });
    } catch (err) {
      setLoadState({ status: 'error', error: err.message });
    }
  };

  useEffect(() => { load(); }, []);

  const pickCategory = (key) => { setSelectedCategory(key); setSelectedSlug(null); };
  const pickService = (slug) => { setSelectedSlug(slug); setEditIndex(null); setTplForm(EMPTY_TPL_FORM); setTplError(''); setTplDone(''); };
  const backToCategories = () => { setSelectedCategory(null); setSelectedSlug(null); };
  const backToServices = () => { setSelectedSlug(null); setEditIndex(null); setTplForm(EMPTY_TPL_FORM); };

  const onTplChange = (e) => {
    const { name, value } = e.target;
    setTplForm((f) => ({ ...f, [name]: value }));
  };

  const startEdit = (i, tpl) => {
    setEditIndex(i);
    setTplForm({ name: tpl.name, image: tpl.image || '', url: tpl.url || '' });
    setTplError('');
    setTplDone('');
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setTplForm(EMPTY_TPL_FORM);
  };

  const onDelete = async (i, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setTplError('');
    setTplDone('');
    try {
      const res = await fetch(`${API_URL}/services/${selectedSlug}/templates/${i}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not delete template');
      setTplDone(`Deleted "${name}".`);
      if (editIndex === i) cancelEdit();
      load();
    } catch (err) {
      setTplError(err.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!tplForm.name.trim()) {
      setTplError('Name is required');
      return;
    }
    setTplError('');
    setTplDone('');
    setTplSaving(true);
    try {
      const url = editIndex === null
        ? `${API_URL}/services/${selectedSlug}/templates`
        : `${API_URL}/services/${selectedSlug}/templates/${editIndex}`;
      const res = await fetch(url, {
        method: editIndex === null ? 'PATCH' : 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(tplForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not save template');
      setTplDone(editIndex === null ? `Added "${tplForm.name}".` : `Updated "${tplForm.name}".`);
      setEditIndex(null);
      setTplForm(EMPTY_TPL_FORM);
      load();
    } catch (err) {
      setTplError(err.message);
    } finally {
      setTplSaving(false);
    }
  };

  return (
    <>
      <Seo title="Services | WebOnspark Technologies" description="Manage services." path="/admin/services" noindex />
      <AdminLayout title="Services">
        {loadState.status === 'loading' && (
          <Row className="g-3">
            {[0, 1].map((i) => (
              <Col key={i} md={6}>
                <div className="skel-card">
                  <SkeletonBlock width={40} height={40} className="skel-circle mb-3" />
                  <SkeletonLine width="60%" height={20} className="mb-2" />
                  <SkeletonLine width="40%" />
                </div>
              </Col>
            ))}
          </Row>
        )}
        {loadState.status === 'error' && <div className="form-error" role="alert">{loadState.error}</div>}

        {loadState.status === 'ready' && !selectedCategory && (
          <Row className="g-3">
            {CATEGORIES.map((c) => {
              const count = services.filter((s) => s.category === c.key).length;
              return (
                <Col key={c.key} md={6}>
                  <Card body className="h-100 admin-nav-card" onClick={() => pickCategory(c.key)} role="button">
                    <span className="ct-icon mb-3"><Icon name={c.icon} size={24} /></span>
                    <Card.Title as="h2" className="h5">{c.label}</Card.Title>
                    <Card.Text className="text-muted mb-0">{count} services</Card.Text>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {loadState.status === 'ready' && selectedCategory && !selectedSlug && (
          <>
            <button type="button" className="btn btn-sm btn-outline-brand mb-3" onClick={backToCategories}>
              ← App or Website
            </button>
            <Row className="g-3">
              {servicesInCategory.map((s) => (
                <Col key={s.slug} md={4}>
                  <Card body className="h-100 admin-nav-card" onClick={() => pickService(s.slug)} role="button">
                    <Card.Title as="h2" className="h6">{s.name}</Card.Title>
                    <Card.Text className="text-muted mb-0">{s.templates?.length || 0} templates</Card.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {selectedSlug && (
          <>
            <button type="button" className="btn btn-sm btn-outline-brand mb-3" onClick={backToServices}>
              ← {CATEGORIES.find((c) => c.key === selectedCategory)?.label}
            </button>

            <Form noValidate onSubmit={onSubmit} className="mb-4">
              <h2 className="h6">{editIndex === null ? `Add a template to ${selectedService?.name}` : `Edit template — ${selectedService?.name}`}</h2>
              <Row className="g-3">
                <Col md={5}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" value={tplForm.name} onChange={onTplChange} placeholder="e.g. Plasery" />
                </Col>
                <Col md={7}>
                  <Form.Label>Website URL</Form.Label>
                  <Form.Control name="url" value={tplForm.url} onChange={onTplChange} placeholder="https://…" />
                </Col>
                <Col md={12}>
                  <Form.Label>Image</Form.Label>
                  <ImageDropzone value={tplForm.image} onChange={(url) => setTplForm((f) => ({ ...f, image: url }))} />
                </Col>
                <Col md={12} className="d-flex gap-2">
                  <button type="submit" className="btn btn-brand" disabled={tplSaving}>
                    {tplSaving ? 'Saving…' : editIndex === null ? 'Add' : 'Save'}
                  </button>
                  {editIndex !== null && (
                    <button type="button" className="btn btn-outline-brand" onClick={cancelEdit}>Cancel</button>
                  )}
                </Col>
              </Row>
              {tplError && <div className="form-error mt-3" role="alert">{tplError}</div>}
              {tplDone && <div className="text-success mt-3">{tplDone}</div>}
            </Form>

            <h2 className="h6">Templates on {selectedService?.name}</h2>
            {currentTemplates.length === 0 ? (
              <p className="text-muted">No templates yet.</p>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover size="sm" className="align-middle">
                  <thead><tr><th>Sl. No</th><th>Name</th><th>Image</th><th>URL</th><th></th></tr></thead>
                  <tbody>
                    {currentTemplates.map((t, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{t.name}</td>
                        <td>{t.image ? <SkeletonImage src={t.image} alt={t.name} className="tpl-table-thumb" /> : '—'}</td>
                        <td className="text-truncate" style={{ maxWidth: 200 }}>{t.url || '—'}</td>
                        <td className="text-nowrap">
                          <button type="button" className="btn btn-sm btn-outline-brand me-2" onClick={() => startEdit(i, t)}>Edit</button>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(i, t.name)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
      </AdminLayout>
    </>
  );
}
