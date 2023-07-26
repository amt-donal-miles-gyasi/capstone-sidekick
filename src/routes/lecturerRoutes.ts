import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  updateAssignment,
} from '../controllers/assignment';
import { locationToJson } from '../controllers/viewStudentAssignment';
import { lecturerSubmissions } from '../controllers/lectureSubmissions';

const router = Router();

router.post('/create-assignment', createAssignment);
router.get('/assignments', getAssignments);
router.put('/update-assignment:id', updateAssignment);
router.get('/submissions/:filename/:studentId', locationToJson);
router.get('/submissions/student-submission', lecturerSubmissions);

export default router;
