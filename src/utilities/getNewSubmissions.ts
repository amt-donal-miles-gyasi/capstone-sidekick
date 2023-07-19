import { prisma } from '../config/prisma-connection';
import { logger } from './logger';

export const getNewSubmissions = async () => {
  try {
    const submissions = await prisma.submissions.findMany({
      where: {
        submittedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
      include: {
        student: true,
        assignment: true,
      },
    });

    return submissions;
  } catch (error) {
    logger.error(error);
  }
};
