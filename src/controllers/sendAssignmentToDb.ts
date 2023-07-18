import { prisma } from '../config/prisma-connection';
import { Request, Response } from 'express';
import config from '../config/variables';
import AdmZip from 'adm-zip';
import AWS from 'aws-sdk';
import { sendAssignmentConfimation } from '../utilities/nodemailer-utility';

// import fs from 'fs';

AWS.config.update({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY,
  region: config.REGION,
});

const s3 = new AWS.S3();
const bucketName = config.BUCKET_NAME;
const fileLocation = [];

export const sendToDb = async (req: Request, res: Response) => {
  const file = req.file;
  const folderName = file.originalname;
  const folderExtension = folderName.split('.').pop();

  const { student_id, assignment_id } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  if (!assignment_id || !student_id) {
    return res
      .status(400)
      .json({ error: 'Missing expected variables in the request body' });
  }

  if (folderExtension !== 'zip') {
    return res
      .status(400)
      .json({ success: false, message: 'File has to be a zip file' });
  }

  try {
    const zip = new AdmZip(file.path);
    const zipEntries = zip.getEntries();
    for (const zipEntry of zipEntries) {
      await processZipEntry(zipEntry);
    }

    if (fileLocation.length === 0) {
      throw new Error('filelocation is empty');
    }
    const snapshot = await saveSubmissions(
      student_id,
      folderName,
      assignment_id,
      fileLocation
    );
    await sendStudentMail(student_id, assignment_id);

    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      response: fileLocation,
      snapshot: snapshot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload files...',
      error: error,
    });
  }
};

const processZipEntry = async (zipEntry: AdmZip.IZipEntry) => {
  const entryFileName = zipEntry.entryName;
  const entryObjectKey = entryFileName;

  if (zipEntry.isDirectory) {
    await unzipNestedZipFolders(zipEntry);
  } else {
    const entryBuffer = zipEntry.getData();
    await uploadToS3(entryBuffer, bucketName, entryObjectKey);
  }
};

const unzipNestedZipFolders = async (zipEntry: AdmZip.IZipEntry) => {
  const zip = new AdmZip(zipEntry.getData());
  const zipEntries = zip.getEntries();

  for (const nestedZipEntry of zipEntries) {
    await processZipEntry(nestedZipEntry);
  }
};

const uploadToS3 = async (fileStream, bucketName, objectKey) => {
  // Set the S3 upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: objectKey,
    Body: fileStream,
  };

  try {
    // Upload the file to S3
    const data = await s3.upload(uploadParams).promise();
    fileLocation.push(data.Location);
  } catch (error) {
    throw new Error('Error uploading file to S3:' + error.message);
  }
};

const saveSubmissions = async (studentId, folderName, assignmentId, texts) => {
  try {
    const submission = await prisma.submissions.create({
      data: {
        studentId,
        folderName,
        uniqueCode: assignmentId,
        locations: texts,
      },
    });
    return submission;
  } catch (error) {
    throw new Error('Error uploading file to S3: ' + error.message);
  }
};

const sendStudentMail = async (studentId, assignmentId) => {
  const student = await prisma.student.findUnique({
    where: {
      studentId,
    },
  });

  const assignment = await prisma.assignment.findUnique({
    where: {
      uniqueCode: assignmentId,
    },
  });

  const name = `${student.firstName} ${student.lastName}`;
  const date = new Date(Date.now());

  await sendAssignmentConfimation(
    name,
    student.email,
    assignment.title,
    assignment.description,
    assignment.deadline,
    assignmentId,
    date
  );
};
