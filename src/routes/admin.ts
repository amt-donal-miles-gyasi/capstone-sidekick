import { Router } from 'express';
import multer from 'multer';
import { adminGenerateLecturers } from '../controllers/adminCreateLecturersController';
import { adminGenerateStundent } from '../controllers/adminCreatingStudentsController';
import { uploadBulkStudents } from '../controllers/bulkStudentUpload';
import { uploadBulkLecturers } from '../controllers/bulkLecturersUpload';
import { emailCheck } from '../middlewares/email-check';
import {
  getAllLectures,
  getAllStudents,
  getAllUsers,
  getAllAss,
  getAllSubmissions,
} from '../controllers/adminDashboard';

const upload = multer({ dest: './uploads' });

/**
 * Contains functions for
 * adding a lecturer,
 * adding a student,
 * bulk uploading student information,
 * bulk uploading lecturer information.
 */
const app: Router = Router();

app.get('/get-users', getAllUsers);
app.get('/get-lecturers', getAllLectures);
app.get('/get-students', getAllStudents);
app.get('/get-assignments', getAllAss);
app.get('/get-submissions', getAllSubmissions);
app.post('/create-lecturer', emailCheck, adminGenerateLecturers);
app.post('/create-student', emailCheck, adminGenerateStundent);

app.post('/upload-students-info', upload.single('file'), uploadBulkStudents);
app.post('/upload-lecturers-info', upload.single('file'), uploadBulkLecturers);

export default app;
