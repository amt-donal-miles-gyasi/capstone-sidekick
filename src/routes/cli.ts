import { Router } from 'express';
// import { checkUser } from '../controllers/pyEndpointController';
import { submissionController } from '../controllers/sendAssignmentToDb';
// import { midCheckUser, MidwareCheckAss } from '../middlewares/studentChecker';
import multer from 'multer';
import { MidwareCheckAssignment } from '../middlewares/confirmStudentAssignment';

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
const upload = multer({ dest: '../../uploads' });

// router.post('/confirm-student', checkUser);
// router.post('/check-assignment', midCheckUser, MidwareCheckAss);
//router.use(isAuthenticated);
//router.use(isStudent);
router.post(
  '/submit',
  upload.single('file'),
  MidwareCheckAssignment,
  submissionController
);
router.post('/abc', (req, res) => {
  console.log(req)
  if(req) return res.status(200).json('Seen');
});
export default router;
