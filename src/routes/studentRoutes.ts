import { Router } from 'express';
import { getAssignments } from '../controllers/assignment';
import { getStudentSubmissions } from '../controllers/studentSubmissions';

const router = Router();

router.get('/assignments', getAssignments);
router.get('/submissions', getStudentSubmissions);

export default router;
('');
