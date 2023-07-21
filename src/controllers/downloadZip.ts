import { Response, Request } from 'express';
import config from '../config/variables';
import AWS from 'aws-sdk';
import AdmZip from 'adm-zip';
import fs from 'fs';

const s3 = new AWS.S3();
const bucketName = config.BUCKET_NAME;

//function to download and zip snapshots
export const downloadSnapFromS3 = async (req: Request, res: Response) => {
  const { objectKeys } = req.body;
  //   const objectKeys = [
  //     'clizip/',
  //     'clizip/1st5.txt',
  //     'clizip/2nd.txt',
  //     'clizip/3rd.txt',
  //     'clizip/subfolder1/',
  //     'clizip/subfolder1/sub file1.txt',
  //     'clizip/subfolder1/subfile2.txt',
  //     'subZip2/',
  //     'subZip2/subzip2File1.txt',
  //     'subZip2/subZip2File2.txt',
  //   ];
  //   const decode = decodeURIComponent()

  //   const objectKeys = [
  //     'testziping/',
  //     'testziping/folder.txt',
  //     'testziping/hmmm.txt',
  //     'testziping/jjj.txt',
  //     'testziping/subfolder/',
  //     'testziping/subfolder/subfile.txt',
  //   ];
  if (!objectKeys) {
    res
      .status(400)
      .json({ staus: 'error', message: 'missing objectKeys in request body' });
  }
  // gets files from s3
  const createZipFile = async (objectKeys: string[]) => {
    const zip = new AdmZip();

    await Promise.all(
      objectKeys.map(async (objectKey) => {
        const params = {
          Bucket: bucketName,
          Key: objectKey,
        };

        const fileStream = s3.getObject(params).createReadStream();
        const chunks: Buffer[] = [];

        await new Promise<void>((resolve, reject) => {
          fileStream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          fileStream.on('end', () => {
            const fileBuffer = Buffer.concat(chunks);
            zip.addFile(objectKey, fileBuffer);
            resolve();
          });

          fileStream.on('error', (error: Error) => {
            reject(error);
          });
        });
      })
    );

    return zip.toBuffer();
  };

  try {
    // handles download
    const zipBuffer = await createZipFile(objectKeys);
    await fs.promises.writeFile('files1.zip', zipBuffer);
    // res.attachment('files.zip');
    res.download('files1.zip', 'snapshot.zip');
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', error, message: 'Failed to create zip file' });
  }
};
