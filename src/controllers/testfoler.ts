import AWS from 'aws-sdk';
import config from '../config/variables';
import { promises as fs, createReadStream } from 'fs';
import { Request, Response } from 'express';
import path from 'node:path';
import * as zlib from 'zlib';
// import { prisma } from '../config/prisma-connection';
import {
  getAssignmentId,
  getStudentId,
  saveSubmissions,
  sendStudentMail,
} from '../utilities/assignmentUtils';

AWS.config.update({
  accessKeyId: config.ACCESS_KEY_ID,
  secretAccessKey: config.SECRET_ACCESS_KEY,
  region: config.REGION,
});

const s3 = new AWS.S3();
const bucketName = config.BUCKET_NAME;
const locations: string[] = [];

export const assignmentController = async (req: Request, res: Response) => {
  const { sample_data_object } = req.body;
  const folderName =
    sample_data_object.author + '-' + sample_data_object.assignment;

  const slug = sample_data_object.snap_content.Slug;
  const assignmentUniqueCode = sample_data_object.assignment;
  const studentStaffId = sample_data_object.author;
  const folderPath = path.join(__dirname, slug);

  try {
    await creatFolderandFiles(sample_data_object.file_contents, slug);
    // await uploadToS3(bucketName, folderPath, folderName);
    const uploadedLocations = await uploadDir(
      folderPath,
      bucketName,
      slug,
      folderName
    );
    const studentId = await getStudentId(studentStaffId);
    //const { id } = await getAssignmentId(assignmentUniqueCode);
    //console.log(id);

    const saveSnapshot = await saveSubmissions(
      studentId,
      assignmentUniqueCode,
      uploadedLocations,
      slug,
      folderName
    );

    await sendStudentMail(studentStaffId, assignmentUniqueCode);
    fs.unlink(folderPath);

    res.status(200).json({
      status: 'success',
      data: {
        slug: slug,
        locations: locations,
        upload: uploadedLocations,
        snapshot: saveSnapshot,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const creatFolderandFiles = async (fileContents, root) => {
  const folderName = root;
  const folderPath = path.join(__dirname, folderName);

  try {
    await fs.mkdir(folderPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating folder "${folderName}":`, error);
    return;
  }

  for (const filePath in fileContents) {
    const compressedFileContent = fileContents[filePath];
    try {
      const fileContent = await decompressContent(compressedFileContent);
      const fullPath = path.join(folderPath, filePath);
      const parentFolder = path.dirname(fullPath);

      await fs.mkdir(parentFolder, { recursive: true }); // Create parent folders
      await fs.writeFile(fullPath, fileContent);
      console.log(`File "${filePath}" created successfully.`);
    } catch (error) {
      console.error(`Error creating file "${filePath}":`, error);
      throw new Error(`Error creating file "${filePath}":`);
    }
  }
};

async function uploadDir(
  s3Path: string,
  bucketName: string,
  slug: string,
  folderName: string
) {
  const locations: string[] = []; // Create an array to store S3 locations

  const getFiles = async (dir: string): Promise<string | string[]> => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      })
    );
    return Array.prototype.concat(...files);
  };

  const files = (await getFiles(s3Path)) as string[];
  const uploads = files.map(async (filePath) => {
    const relativeKey = `${folderName}/${slug}/${path
      .relative(s3Path, filePath)
      .replace(/\\/g, '/')}`;
    console.log('Relative Key:', relativeKey);

    try {
      // Use createReadStream to create a readable stream from the file
      const params = {
        Bucket: bucketName,
        Key: relativeKey,
        Body: createReadStream(filePath),
      };

      const result = await s3.upload(params).promise();
      const location = result.Location;
      locations.push(location);
      console.log(
        `File "${path.basename(
          filePath
        )}" uploaded to S3 successfully. Location: ${location}`
      );
      return result;
    } catch (error) {
      console.error(
        `Error uploading file "${path.basename(filePath)}" to S3:`,
        error
      );
    }
  });

  await Promise.all(uploads);
  return locations;
}

const decompressContent = async (
  compressedContent: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Decode the base64 compressed content to a buffer
    const compressedBuffer = Buffer.from(compressedContent, 'base64');

    // Decompress the buffer using zlib
    zlib.unzip(compressedBuffer, (err, decompressedBuffer) => {
      if (err) {
        reject(err);
      } else {
        // Convert the decompressed buffer back to a string
        const decompressedContent = decompressedBuffer.toString('utf-8');
        resolve(decompressedContent);
      }
    });
  });
};

// const files = await fs.readdir(folderPath);
//   for (const file of files) {
//     const filePath = path.join(folderPath, file);
//     const fileStream = await fs.readFile(filePath);

//     const params = {
//       Bucket: bucketName,
//       Key: `${folderName}/${file}`,
//       Body: fileStream,
//     };

//     try {
//       const result = await s3.upload(params).promise();
//       const s3Location = result.Location;
//       console.log(
//         `File "${file}" uploaded to S3 successfully. Location: ${s3Location}`
//       );
//       locations.push(s3Location); // Push the S3 location to the array
//     } catch (error) {
//       console.error(`Error uploading file "${file}" to S3:`, error);
//     }
//   }

// (async () => {
//   try {
//     const uploadedLocations = await uploadDir(path.resolve('./my-path'), 'bucketname');
//     console.log('Upload completed successfully.');
//     console.log('Uploaded locations:', uploadedLocations);
//   } catch (error) {
//     console.error('Error during upload:', error);
//   }
// })();

// import { promises as fs, createReadStream } from 'fs';
// import * as path from 'path';
// import { S3 } from 'aws-sdk';
