import { Prisma } from '@prisma/client';

export type Submissions = Prisma.SubmissionsGetPayload<{
  include: {
    student: true,
    assignment: true,
  }
}>;
