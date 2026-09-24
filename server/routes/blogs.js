import { Router } from 'express';
import { getBlogs, getBlogBySlug, addBlog, editBlog, removeBlog } from '../controllers/blogsController.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', verifyAdmin, addBlog);
router.put('/:slug', verifyAdmin, editBlog);
router.delete('/:slug', verifyAdmin, removeBlog);

export default router;
