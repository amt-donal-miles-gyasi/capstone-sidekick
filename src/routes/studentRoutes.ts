import { Router } from 'express';
import { getAssignments } from '../controllers/assignment';

const router = Router();

router.get('/assignments', getAssignments);

export default router;
