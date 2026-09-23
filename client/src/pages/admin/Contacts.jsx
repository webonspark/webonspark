import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminSubmissionsTable from '../../components/admin/AdminSubmissionsTable';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'subject', label: 'Subject' },
  { key: 'service', label: 'Interested in' },
  { key: 'message', label: 'Message' },
];

export default function AdminContacts() {
  return (
    <>
      <Seo title="Contacts | WebOnspark Technologies" description="Contact form submissions." path="/admin/contacts" noindex />
      <AdminLayout title="Contacts">
        <AdminSubmissionsTable formType="Contact" columns={COLUMNS} emptyText="No contact messages yet." />
      </AdminLayout>
    </>
  );
}
