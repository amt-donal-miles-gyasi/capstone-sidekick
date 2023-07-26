import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';

export const locationToJson = async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  if (!submissionId) {
    return res
      .status(400)
      .json({ error: 'Missing expected variables in the request params' });
  }

  try {
    const fileLocations = await prisma.submissions.findFirst({
      where: {
        id: submissionId,
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
    );
    pathWithoutBucket = pathWithoutBucket.replace('dev-june/', '');
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
