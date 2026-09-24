import { Router } from 'express';
import { login, stats, getAdmins, addAdmin, changeAdminPassword, removeAdmin } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.post('/login', login);
router.get('/stats', verifyAdmin, stats);
router.get('/admins', verifyAdmin, getAdmins);
router.post('/admins', verifyAdmin, addAdmin);
router.put('/admins/:id/password', verifyAdmin, changeAdminPassword);
router.delete('/admins/:id', verifyAdmin, removeAdmin);

export default router;
