import { Router } from 'express';
import adminRoutes from './admin';
import authRoutes from './authentication';
import LecturerBulkUpload from './lecturer-bulk-upload';
import StudentBulkUpload from './student-bulk-upload';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/bulk', StudentBulkUpload);
router.use('/bulk', LecturerBulkUpload);

export default router;
