import { Router } from 'express';
import { adminGenerateLecturers } from '../controllers/adminCreateLecturersController';
import { adminGenerateStundent } from '../controllers/adminCreatingStudentsController';

const app = Router();

app.post('/uplaod-lecturer-info', adminGenerateLecturers);
app.post('/uplaod-student-info', adminGenerateStundent);

export default app;
