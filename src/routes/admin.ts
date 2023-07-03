import { Router } from 'express';
import { adminGenerateLecturers } from '../controllers/adminCreateLecturersController';
import { adminGenerateStundent } from '../controllers/adminCreatingStudentsController';
import { emailCheck } from '../middlewares/email-check';
import {
  getAllLectures,
  getAllStudents,
  getAllUsers,
  getAllAss,
} from '../controllers/adminDashboard';

const app = Router();

app.get('/get-users', getAllUsers);
app.get('/get-lecturers', getAllLectures);
app.get('/get-students', getAllStudents);
app.get('/get-assignments', getAllAss);
app.post('/upload-lecturer', emailCheck, adminGenerateLecturers);
app.post('/upload-student', adminGenerateStundent);

export default app;
