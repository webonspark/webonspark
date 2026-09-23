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

const slugify = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Lightweight markdown-like authoring: "## " heading, "### " subheading, "> " tip,
// "- " consecutive lines become one bullet list, blank line separates paragraphs.
function parseContent(text) {
  const blocks = [];
  let para = [];
  let list = null;
  const flushPara = () => { if (para.length) { blocks.push(['p', para.join(' ')]); para = []; } };
  const flushList = () => { if (list) { blocks.push(['ul', list]); list = null; } };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (line.startsWith('## ')) { flushPara(); flushList(); blocks.push(['h2', line.slice(3)]); }
    else if (line.startsWith('### ')) { flushPara(); flushList(); blocks.push(['h3', line.slice(4)]); }
    else if (line.startsWith('> ')) { flushPara(); flushList(); blocks.push(['tip', line.slice(2)]); }
    else if (line.startsWith('- ')) { flushPara(); if (!list) list = []; list.push(line.slice(2)); }
    else { flushList(); para.push(line); }
  }
  flushPara();
  flushList();
  return blocks;
}

const EMPTY = {
  slug: '', title: '', seoTitle: '', description: '', date: new Date().toISOString().slice(0, 10),
  readTime: '5', category: '', tags: '', excerpt: '', content: '',
};

export default function AdminBlogs() {
  const admin = getAdmin();
  const [blogs, setBlogs] = useState([]);
  const [loadState, setLoadState] = useState({ status: 'loading', error: '' });
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const authHeaders = admin ? { Authorization: `Bearer ${admin.token}` } : {};

  const load = async () => {
    setLoadState({ status: 'loading', error: '' });
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load blog posts');
      setBlogs(data.blogs);
      setLoadState({ status: 'ready', error: '' });
    } catch (err) {
      setLoadState({ status: 'error', error: err.message });
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === 'title' && !f._slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      setFormError('Title and slug are required');
      return;
    }
    setFormError('');
    setSaving(true);

    const payload = {
      slug: form.slug,
      title: form.title,
      seoTitle: form.seoTitle || form.title,
      description: form.description || form.excerpt,
      date: form.date,
      readTime: Number(form.readTime) || 5,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      excerpt: form.excerpt,
      content: parseContent(form.content),
    };

    try {
      const res = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not add blog post');
      setForm(EMPTY);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="Blogs | WebOnspark Technologies" description="Manage blog posts." path="/admin/blogs" noindex />
      <AdminLayout title="Blogs">
        <Form noValidate onSubmit={onAdd} className="mb-5">
          <h2 className="h6">Add a blog post</h2>
          <Row className="g-3">
            <Col md={7}>
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={form.title} onChange={onChange} required />
            </Col>
            <Col md={5}>
              <Form.Label>Slug</Form.Label>
              <Form.Control name="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value, _slugTouched: true }))} required />
            </Col>
            <Col md={6}>
              <Form.Label>SEO title</Form.Label>
              <Form.Control name="seoTitle" value={form.seoTitle} onChange={onChange} />
            </Col>
            <Col md={6}>
              <Form.Label>Meta description</Form.Label>
              <Form.Control name="description" value={form.description} onChange={onChange} />
            </Col>
            <Col md={3}>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={form.date} onChange={onChange} />
            </Col>
            <Col md={3}>
              <Form.Label>Read time (min)</Form.Label>
              <Form.Control type="number" min="1" name="readTime" value={form.readTime} onChange={onChange} />
            </Col>
            <Col md={3}>
              <Form.Label>Category</Form.Label>
              <Form.Control name="category" value={form.category} onChange={onChange} placeholder="e.g. SEO" />
            </Col>
            <Col md={3}>
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control name="tags" value={form.tags} onChange={onChange} />
            </Col>
            <Col md={12}>
              <Form.Label>Excerpt</Form.Label>
              <Form.Control as="textarea" rows={2} name="excerpt" value={form.excerpt} onChange={onChange} />
            </Col>
            <Col md={12}>
              <Form.Label>Content</Form.Label>
              <Form.Text className="d-block mb-2 text-muted">
                Plain paragraphs, blank line between them. <code>## </code> for a heading, <code>### </code> for a subheading,
                <code> - </code> for bullet points, <code>&gt; </code> for a highlighted tip.
              </Form.Text>
              <Form.Control as="textarea" rows={10} name="content" value={form.content} onChange={onChange} />
            </Col>
          </Row>

          <div className="mt-3">
            <button type="submit" className="btn btn-brand" disabled={saving}>{saving ? 'Adding…' : 'Add blog post'}</button>
          </div>
          {formError && <div className="form-error mt-3" role="alert">{formError}</div>}
        </Form>

        <h2 className="h6">Existing posts</h2>
        {loadState.status === 'error' && <div className="form-error" role="alert">{loadState.error}</div>}
        {(loadState.status === 'loading' || loadState.status === 'ready') && (
          <div className="table-responsive">
            <Table striped bordered hover size="sm" className="align-middle">
              <thead><tr><th>Sl. No</th><th>Title</th><th>Category</th><th>Date</th></tr></thead>
              {loadState.status === 'loading' ? <tbody><SkeletonTableRows cols={4} /></tbody> : (
              <tbody>
                {blogs.map((b, i) => (
                  <tr key={b.slug}><td>{i + 1}</td><td>{b.title}</td><td>{b.category}</td><td>{b.date}</td></tr>
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
