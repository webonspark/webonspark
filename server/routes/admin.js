import { Router } from 'express';
import { login, stats } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.post('/login', login);
router.get('/stats', verifyAdmin, stats);

export default router;
