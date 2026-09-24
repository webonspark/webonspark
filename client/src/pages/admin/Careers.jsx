import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminSubmissionsTable from '../../components/admin/AdminSubmissionsTable';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'role', label: 'Position' },
  { key: 'experience', label: 'Experience' },
  { key: 'location', label: 'City' },
  {
    key: (payload) => (payload?.resume
      ? <a href={payload.resume} download={payload.resumeFilename || 'resume.pdf'}>Download</a>
      : '—'),
    label: 'Resume',
  },
  {
    key: (payload) => (payload?.portfolio
      ? <a href={payload.portfolio} target="_blank" rel="noopener noreferrer">Link</a>
      : ''),
    label: 'Portfolio',
  },
  { key: 'message', label: 'Message' },
];

export default function AdminCareers() {
  return (
    <>
      <Seo title="Careers | WebOnspark Technologies" description="Job applications." path="/admin/careers" noindex />
      <AdminLayout title="Careers">
        <AdminSubmissionsTable formType="Career" columns={COLUMNS} emptyText="No applications yet." />
      </AdminLayout>
    </>
  );
}
