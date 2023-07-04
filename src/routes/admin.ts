import { Router } from 'express';
import multer from 'multer';
import { adminGenerateLecturers } from '../controllers/adminCreateLecturersController';
import { adminGenerateStundent } from '../controllers/adminCreatingStudentsController';
import { uploadBulkStudents } from '../controllers/bulkStudentUpload';
import { uploadBulkLecturers } from '../controllers/bulkLecturersUpload';

const upload = multer({ dest: './uploads' });

/**
 * Contains functions for 
 * adding a lecturer, 
 * adding a student, 
 * bulk uploading student information, 
 * bulk uploading lecturer information.
 */
const app: Router = Router();
app.post('/upload-lecturer', adminGenerateLecturers);
app.post('/upload-student', adminGenerateStundent);

app.post('/upload-students-info', upload.single('file'), uploadBulkStudents);
app.post('/upload-lecturers-info', upload.single('file'), uploadBulkLecturers);

export default app;
