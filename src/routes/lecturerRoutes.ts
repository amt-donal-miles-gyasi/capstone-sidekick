import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  updateAssignment,
} from '../controllers/assignment';
import { locationToJson } from '../controllers/viewStudentAssignment';

const router = Router();

router.post('/create-assignment', createAssignment);
router.get('/assignments', getAssignments);
router.put('/update-assignment:id', updateAssignment);
router.get('/submissions/:filename/:studentId', locationToJson);

export default router;
