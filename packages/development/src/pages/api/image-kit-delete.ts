import type { NextApiRequest, NextApiResponse } from 'next';
import ImageKit from 'imagekit';

type DeleteRequest = {
  fileId: string;
};

type DeleteResponse = {
  success: boolean;
  message: string;
  fileId?: string;
};

type ErrorResponse = {
  success: false;
  message: string;
  code?: string;
};

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteResponse | ErrorResponse>,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    return res.status(500).json({
      success: false,
      message: 'ImageKit credentials are not configured',
      code: 'MISSING_CREDENTIALS',
    });
  }

  try {
    const body = JSON.parse(req.body) as DeleteRequest;
    console.log('DeleteRequest body', typeof body, body);
    const fileId = body.fileId;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'FileId is required.',
        code: 'MISSING_FILE_ID',
      });
    }

    await imagekit.deleteFile(fileId);

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      fileId,
    });
  } catch (error: any) {
    console.error('Error deleting file from ImageKit:', error);

    if (error.message?.includes('No file found')) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
        code: 'FILE_NOT_FOUND',
      });
    }

    if (error.message?.includes('Unauthorized')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid credentials',
        code: 'UNAUTHORIZED',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete file',
      code: 'DELETE_FAILED',
    });
  }
}
