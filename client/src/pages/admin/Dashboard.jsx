import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import DonutChart from '../../components/admin/DonutChart';
import { SkeletonLine, SkeletonBlock } from '../../components/Skeleton';
import { API_URL } from '../../config';
import { getAdmin, adminLogout } from '../../utils/adminAuth';

const STATS = [
  { key: 'totalLeads', label: 'Total leads' },
  { key: 'totalEnquiries', label: 'Total enquiries' },
  { key: 'totalContacts', label: 'Total people who contacted us' },
];

const SECTIONS = [
  { to: '/admin/enquiries', label: 'Enquiries', text: 'View enquiry form submissions.' },
  { to: '/admin/contacts', label: 'Contacts', text: 'View contact form submissions.' },
  { to: '/admin/leads', label: 'Leads', text: 'Add, import and track leads.' },
  { to: '/admin/services', label: 'Services', text: 'Add and manage services shown on the site.' },
  { to: '/admin/blogs', label: 'Blogs', text: 'Add and manage blog posts.' },
];

// Validated for CVD-safe adjacency and contrast with scripts/validate_palette.js (dataviz skill).
const LEAD_STATUSES = [
  { key: 'On Hold', color: '#b45309' },
  { key: 'Accepted', color: '#2563eb' },
  { key: 'Rejected', color: '#dc2626' },
  { key: 'Completed', color: '#7c3aed' },
];

export default function AdminDashboard() {
  const [state, setState] = useState({ status: 'loading', stats: null, error: '' });

  useEffect(() => {
    const admin = getAdmin();
    if (!admin) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        if (res.status === 401) {
          adminLogout();
          if (!cancelled) setState({ status: 'error', stats: null, error: 'Your session expired. Please sign in again.' });
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load stats');
        if (!cancelled) setState({ status: 'ready', stats: data, error: '' });
      } catch (err) {
        if (!cancelled) setState({ status: 'error', stats: null, error: err.message });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Seo title="Admin Dashboard | WebOnspark Technologies" description="WebOnspark admin dashboard." path="/admin/dashboard" noindex />
      <AdminLayout title="Dashboard">
        <Row className="g-3 mb-5">
          {SECTIONS.map((s) => (
            <Col key={s.to} md={4}>
              <Card as={Link} to={s.to} body className="h-100 admin-nav-card">
                <Card.Title as="h2" className="h5">{s.label}</Card.Title>
                <Card.Text className="text-muted mb-0">{s.text}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>

        {state.status === 'loading' && (
          <Row className="g-3 mb-3">
            {STATS.map((s) => (
              <Col key={s.key} md={4}>
                <Card body className="text-center h-100 admin-stat-card">
                  <SkeletonBlock width={80} height={36} className="mx-auto mb-2" />
                  <SkeletonLine width="60%" className="mx-auto" />
                </Card>
              </Col>
            ))}
          </Row>
        )}
        {state.status === 'error' && <div className="form-error" role="alert">{state.error}</div>}

        {state.status === 'ready' && (
          <>
            <Row className="g-3 mb-3">
              {STATS.map((s) => (
                <Col key={s.key} md={4}>
                  <Card body className="text-center h-100 admin-stat-card">
                    <div className="display-5 fw-bold text-brand">{state.stats[s.key]}</div>
                    <div className="text-muted">{s.label}</div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Card body className="admin-stat-card">
              <Card.Title as="h2" className="h6 mb-3">Leads by status</Card.Title>
              <DonutChart
                data={LEAD_STATUSES.map(({ key, color }) => ({
                  label: key,
                  value: state.stats.leadsByStatus[key] || 0,
                  color,
                }))}
                centerLabel={{ value: state.stats.totalLeads, label: 'Total leads' }}
              />
            </Card>
          </>
        )}
      </AdminLayout>
    </>
  );
}
