import Seo from '../../components/Seo';
import AdminLayout from '../../components/AdminLayout';
import AdminSubmissionsTable from '../../components/AdminSubmissionsTable';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'service', label: 'Service' },
  { key: 'template', label: 'Template' },
  { key: 'budget', label: 'Budget' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'message', label: 'Message' },
];

export default function AdminEnquiries() {
  return (
    <>
      <Seo title="Enquiries | WebOnspark Technologies" description="Enquiry form submissions." path="/admin/enquiries" noindex />
      <AdminLayout title="Enquiries">
        <AdminSubmissionsTable formType="Enquiry" columns={COLUMNS} emptyText="No enquiries yet." />
      </AdminLayout>
    </>
  );
}
