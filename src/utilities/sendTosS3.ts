// import config from '../config/variables';
// import AWS from 'aws-sdk';

// AWS.config.update({
//   accessKeyId: config.ACCESS_KEY_ID,
//   secretAccessKey: config.SECRET_ACCESS_KEY,
//   region: config.REGION,
// });

// const s3 = new AWS.S3();

// const fileLocation = [];

// export const uploadToS3 = async (fileStream, bucketName, objectKey) => {
//   // Set the S3 upload parameters
//   const uploadParams = {
//     Bucket: bucketName,
//     Key: objectKey,
//     Body: fileStream,
//   };

//   try {
//     // Upload the file to S3
//     const data = await s3.upload(uploadParams).promise();
//     // console.log('File uploaded successfully:', data.Location);
//     fileLocation.push(data.Location);
//     return fileLocation;
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw error;
//   }
// };
