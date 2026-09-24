import Seo from '../../components/Seo';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminSubmissionsTable from '../../components/admin/AdminSubmissionsTable';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'subject', label: 'Subject' },
  { key: 'service', label: 'Interested in' },
  // Contact form uses "message", the homepage Question form uses "question" —
  // show either under one column so both read naturally in the same table.
  { key: (payload) => payload?.message || payload?.question || '', label: 'Message' },
];

export default function AdminContacts() {
  return (
    <>
      <Seo title="Contacts | WebOnspark Technologies" description="Contact and question form submissions." path="/admin/contacts" noindex />
      <AdminLayout title="Contacts">
        <AdminSubmissionsTable formTypes={['Contact', 'Question']} columns={COLUMNS} emptyText="No contact messages or questions yet." />
      </AdminLayout>
    </>
  );
}
