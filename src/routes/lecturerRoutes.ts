import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  updateAssignment,
} from '../controllers/assignment';

const router = Router();

router.post('/create-assignment', createAssignment);
router.get('/assignments', getAssignments);
router.put('/update-assignment:id', updateAssignment);

export default router;
