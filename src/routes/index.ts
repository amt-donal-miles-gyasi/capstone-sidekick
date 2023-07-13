import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authentication';
import { isAdmin, isLecturer, isStudent } from '../middlewares/rolecheker';
import adminRoutes from './admin';
import authRoutes from './authentication';
import lecturerRoutes from './lecturerRoutes';
import studentRoutes from './studentRoutes';
import cliRoutes from './cli'

const router = Router();

router.use('/cli', cliRoutes)

router.use('/auth', authRoutes);

router.use(isAuthenticated);

// Lecturer routes
router.use('/lecturer', isLecturer, lecturerRoutes);

// Student routes
router.use('/student', isStudent, studentRoutes)

router.use(isAdmin);
router.use('/admin', adminRoutes);

export default router;
