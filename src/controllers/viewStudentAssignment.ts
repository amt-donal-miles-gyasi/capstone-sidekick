import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';

export const locationToJson = async (req: Request, res: Response) => {
  const { filename, studentId } = req.params;
  if (!filename || !studentId) {
    return res
      .status(400)
      .json({ error: 'Missing expected variables in the request body' });
  }

  try {
    const fileLocations = await prisma.submissions.findFirst({
      where: {
        folderName: filename,
        studentId,
      },
    });

    const folderStructure = buildFileStructure(fileLocations.locations);

    res.status(200).json({
      success: true,
      data: folderStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

const buildFileStructure = (paths) => {
  const fileStructure = {};

  for (const path of paths) {
    let pathWithoutBucket = path.replace(
      'https://training-gitinspired-media.s3.eu-west-1.amazonaws.com/',
      ''
    ); // Replace 'https://your-bucket-url/' with your actual S3 bucket URL
    pathWithoutBucket = pathWithoutBucket.replace('dev-june/', ''); // Replace 'bucket-name/' with your actual S3 bucket name
    const pathParts = pathWithoutBucket.split('/');
    let currentDir = fileStructure;

    for (const part of pathParts) {
      if (!currentDir[part]) {
        currentDir[part] = {};
      }
      currentDir = currentDir[part];
    }
  }

  return fileStructure;
};
