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

/**
 * Extract fileId from ImageKit URL
 * Example: https://ik.imagekit.io/your_id/path/to/file_ABC123.jpg -> ABC123
 */
const extractFileIdFromUrl = (url: string): string | null => {
  try {
    // ImageKit URL format: https://ik.imagekit.io/{imagekit_id}/{path}/{fileName}_{fileId}.{ext}
    // FileId is usually in the filename before the extension

    // Method 1: Extract from URL pattern
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split('/').pop();
    console.log('fileName', fileName);
    if (!fileName) return null;

    // FileId is usually the part before the extension after underscore
    // Example: image_ABC123.jpg -> ABC123
    const match = fileName.match(/_([a-zA-Z0-9]+)\.[^.]+$/);
    console.log('match', match);
    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch (error) {
    console.error('Error extracting fileId from URL:', error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteResponse | ErrorResponse>,
) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  // Validate credentials
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    return res.status(500).json({
      success: false,
      message: 'ImageKit credentials are not configured',
      code: 'MISSING_CREDENTIALS',
    });
  }

  try {
    const body = req.body as DeleteRequest;
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
