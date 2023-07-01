import { Router } from 'express';
import { adminGenerateLecturers } from '../controllers/adminCreateLecturersController';
import { adminGenerateStundent } from '../controllers/adminCreatingStudentsController';
import { emailCheck } from '../middlewares/email-check';

const app = Router();

app.post('/upload-lecturer', emailCheck, adminGenerateLecturers);
app.post('/upload-student', adminGenerateStundent);

export default app;
