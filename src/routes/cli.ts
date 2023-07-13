import { Router } from "express";
import { checkUser, checkAss } from "../controllers/pyEndpointController";
import { midCheckUser, MidwareCheckAss } from "../middlewares/studentChecker";

const router = Router()

router.post('/confirm-student', checkUser);
router.post('/check-assignment', midCheckUser, MidwareCheckAss, checkAss);

export default router