import { Router } from 'express';
import adminRoutes from './admin';
import authRoutes from './authentication';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;
