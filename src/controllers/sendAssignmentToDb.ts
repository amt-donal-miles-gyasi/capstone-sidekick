import { Request, Response } from 'express';
import config from '../config/variables';
import AdmZip from 'adm-zip';
import AWS from 'aws-sdk';
import { sendAssignmentConfimation } from '../utilities/nodemailer-utility';
import { prisma } from '../config/prisma-connection';

AWS.config.update({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY,
  region: config.REGION,
});

const s3 = new AWS.S3();
const bucketName = config.BUCKET_NAME;

export const testing = async (req: Request, res: Response) => {
  const file = req.file;
  const folderName = file.originalname;
  const folderExtension = folderName.split('.').pop();

  const { student_id, assignment_id } = req.body;

  if (folderExtension !== 'zip') {
    return res
      .status(400)
      .json({ success: false, message: 'File has to be a zip file' });
  }

  try {
    const fileLocation = [];

    const extractFiles = (zip: AdmZip, zipEntry: AdmZip.IZipEntry) => {
      return new Promise<void>((resolve, reject) => {
        // console.log(32);
        const fileContent = zipEntry.getData();
        const params = {
          Bucket: bucketName,
          Key: zipEntry.entryName,
          Body: fileContent,
        };
        // console.log(39);
        s3.upload(params, (err, data) => {
          if (err) {
            // console.log(41);
            // console.error('Error uploading file:', err);
            reject(err);
          } else {
            // console.log(45);
            // console.log('File uploaded:', data.Location);
            fileLocation.push(data.Location);
            resolve();
          }
        });
      });
    };

    const snapshotZip = new AdmZip(file.path);
    const snapshotEntries = snapshotZip.getEntries();

    for (const entry of snapshotEntries) {
      if (entry.entryName.endsWith('.zip')) {
        const nestedZip = new AdmZip(entry.getData());
        const nestedEntries = nestedZip.getEntries();

        for (const nestedEntry of nestedEntries) {
          await extractFiles(nestedZip, nestedEntry);
        }
      } else {
        await extractFiles(snapshotZip, entry);
      }
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

    res.status(200).json(fileLocation);
  } catch (error) {
    // console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file' });
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
