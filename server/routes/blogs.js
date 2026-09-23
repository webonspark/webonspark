import { Router } from 'express';
import { getBlogs, getBlogBySlug, addBlog } from '../controllers/blogsController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', verifyAdmin, addBlog);

export default router;
