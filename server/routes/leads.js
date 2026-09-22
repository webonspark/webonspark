import { Router } from 'express';
import { addLead, getLeads, patchLeadStatus, importLeads } from '../controllers/leadsController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.use(verifyAdmin);
router.post('/', addLead);
router.post('/import', importLeads);
router.get('/', getLeads);
router.patch('/:id/status', patchLeadStatus);

export default router;
