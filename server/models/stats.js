import { pool } from '../config/db.js';

const LEAD_STATUSES = ['On Hold', 'Accepted', 'Rejected', 'Completed'];

export async function getDashboardStats() {
  const [[row]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM leads) AS totalLeads,
      (SELECT COUNT(*) FROM form_submissions WHERE form_type = 'Enquiry') AS totalEnquiries,
      (SELECT COUNT(*) FROM form_submissions WHERE form_type = 'Contact') AS totalContacts
  `);

  const [statusRows] = await pool.query('SELECT status, COUNT(*) AS count FROM leads GROUP BY status');
  const leadsByStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  statusRows.forEach((r) => { leadsByStatus[r.status] = r.count; });

  return { ...row, leadsByStatus };
}
