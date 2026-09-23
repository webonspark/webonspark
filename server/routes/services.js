import { Router } from 'express';
import { getServices, getServiceBySlug, addService, addTemplate, editTemplate, removeTemplate } from '../controllers/servicesController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', verifyAdmin, addService);
router.patch('/:slug/templates', verifyAdmin, addTemplate);
router.put('/:slug/templates/:index', verifyAdmin, editTemplate);
router.delete('/:slug/templates/:index', verifyAdmin, removeTemplate);

export default router;
