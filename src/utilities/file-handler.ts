import fs from 'fs';
import { Request, Response } from 'express';

/**
 * Retrieves the size of a file in bytes.
 *
 * @param {string} path - The path to the file.
 * @returns {Promise<number>} - A Promise that resolves to the file size in bytes.
 */
export const getFileSize = async (path: string): Promise<number> => {
  const stats = await fs.promises.stat(path);
  return stats.size;
};

/**
 * Deletes a file from the file system.
 *
 * @param {string} path - The path to the file.
 * @returns {Promise<void>} - A Promise that resolves when the file is successfully deleted.
 */
export const deleteFile = async (path: string): Promise<void> => {
  await fs.promises.unlink(path);
};

/**
 * Validates the uploaded CSV file.
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<Response>} - A Promise that resolves to the Express Response.
 */
export const validateCSVFile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (req.file.mimetype !== 'text/csv') {
    return res.status(400).json({ error: 'Invalid file format' });
  }

  const fileSizeInBytes = await getFileSize(req.file.path);
  if (fileSizeInBytes === 0) {
    await deleteFile(req.file.path);
    return res.status(400).json({ error: 'Empty file uploaded' });
  }
  return;
};
