import { Router } from 'express';
// import { checkUser } from '../controllers/pyEndpointController';
// import { submissionController } from '../controllers/sendAssignmentToDb';
// import { midCheckUser, MidwareCheckAss } from '../middlewares/studentChecker';
// import multer from 'multer';
import { isAuthenticated } from '../middlewares/authentication';
import { isStudent } from '../middlewares/rolecheker';
import { midwareCheckAssignment } from '../middlewares/confirmStudentAssignment';
import { assignmentController } from '../controllers/testfoler';

const router = Router();

// const fileStorage = multer.diskStorage({
//   destination: (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     cb(null, '../../zipUploads');
//   },
//   filename: (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, filename: string) => void
//   ) => {
//     cb(null, `${Date.now()}--${file.originalname}`);
//   },
// });

// const upload = multer({ storage: fileStorage });
// const upload = multer({ dest: '../../uploads' });

// router.post('/confirm-student', checkUser);
// router.post('/check-assignment', midCheckUser, MidwareCheckAss);
router.use(isAuthenticated);
router.use(isStudent);
router.post('/submit', midwareCheckAssignment, assignmentController);
export default router;
