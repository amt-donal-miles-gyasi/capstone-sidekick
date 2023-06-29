import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

/* type Student = {
    id: String,
    firstName: String,
    lastName: String,
} */

router.get('/', async (req: Request, res: Response) => {
  // Handle fetching all students
  const students = await prisma.student.findMany({
    include: {
      user: true,
    },
  });
  res.json({ students });
});

router.get('/:id', (req: Request, res: Response) => {
  // Handle fetching a specific students by ID
});

router.post('/', (req: Request, res: Response) => {
  // Handle creating a new students
});

router.put('/:id', (req: Request, res: Response) => {
  // Handle updating a students by ID
});

router.delete('/:id', (req: Request, res: Response) => {
  // Handle deleting a students by ID
});

export default router;
