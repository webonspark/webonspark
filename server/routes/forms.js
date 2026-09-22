import { Router } from 'express';
import { submitForm, listSubmissions } from '../controllers/formsController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.post('/', submitForm);
router.get('/', verifyAdmin, listSubmissions);

export default router;
