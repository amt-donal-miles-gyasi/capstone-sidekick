import { saveSubmissions } from './saveSubmissions';
import { PrismaClient } from '@prisma/client';
import jest from 'ts-jest'

const prisma = new PrismaClient();
jest.

jest.mock('./saveSubmissions', () => ({
  __esModule: true,
  saveSubmissions: jest.fn(),
}));

jest.mock('@prisma/client', () => ({
  __esModule: true,
  PrismaClient: jest.fn().mockImplementation(() => ({
    submissions: {
      create: jest.fn(),
    },
  })),
}));

jest.mock('./getStudentId', () => ({
  getStudentId: jest.fn(() => 'studentTableId'),
}));

jest.mock('./getAssignmentId', () => ({
  getAssignmentId: jest.fn(() => ({ id: 'assignmentId', lecturerId: 'lecturerId' })),
}));

describe('saveSubmissions', () => {
  const studentId = '12345';
  const assignmentId = '67890';
  const texts = ['text1', 'text2', 'text3'];

  beforeAll(() => {
    const prismaClient = new prisma.submissions.create.mockImplementationOnce(() => ({
      id: 'submissionId',
    }));
  });

  it('should return the submission object when all functions execute successfully', async () => {
    const result = await saveSubmissions(studentId, assignmentId, texts);

    expect(result).toEqual({ id: 'submissionId' });
    expect(getStudentId).toHaveBeenCalledWith(studentId);
    expect(getAssignmentId).toHaveBeenCalledWith(assignmentId);
    expect(prisma.submissions.create).toHaveBeenCalledWith({
      data: {
        studentId: 'studentTableId',
        assignmentId: 'assignmentId',
        locations: ['text1', 'text2', 'text3'],
        lecturerId: 'lecturerId',
      },
    });
  });

  it('should throw an error when getStudentId() throws an error', async () => {
    const getStudentId = jest.fn(() => {
      throw new Error('error');
    });

    await expect(saveSubmissions(studentId, assignmentId, texts)).rejects.toThrowError(
      'Error uploading file to S3: error'
    );

    expect(getAssignmentId).not.toHaveBeenCalled();
    expect(prisma.submissions.create).not.toHaveBeenCalled();
  });

  it('should throw an error when getAssignmentId() throws an error', async () => {
    const getAssignmentId = jest.fn(() => {
      throw new Error('error');
    });

    await expect(saveSubmissions(studentId, assignmentId, texts)).rejects.toThrowError(
      'Error uploading file to S3: error'
    );

    expect(getStudentId).toHaveBeenCalled();
    expect(prisma.submissions.create).not.toHaveBeenCalled();
  });

  it('should throw an error when prisma.submissions.create() throws an error', async () => {
    const prismaClient = new prisma.submissions.create.mockImplementationOnce(() => {
      throw new Error('error');
    });

    await expect(saveSubmissions(studentId, assignmentId, texts)).rejects.toThrowError(
      'Error uploading file to S3: error'
    );

    expect(getStudentId).toHaveBeenCalled();
    expect(getAssignmentId).toHaveBeenCalled();
  });
});
