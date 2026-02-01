import type { NextApiRequest, NextApiResponse } from 'next';
import ImageKit from 'imagekit';

type DeleteRequest = {
  fileId?: string;
  src?: string;
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

// Extract fileId from ImageKit URL
function extractFileIdFromUrl(url: string): string | null {
  try {
    // ImageKit URLs typically have fileId in the path or as a parameter
    // Example: https://ik.imagekit.io/your_id/image.jpg or https://ik.imagekit.io/your_id/fileId/image.jpg
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Try to find fileId in path
    if (pathParts.length > 0) {
      // Last part might be the fileId or filename
      const lastPart = pathParts[pathParts.length - 1];
      // Remove extension if present
      const fileId = lastPart.replace(/\.[^/.]+$/, '');
      return fileId;
    }
    
    return null;
  } catch {
    return null;
  }
}

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
    let body: DeleteRequest = {};
    
    // Try to parse JSON body
    if (req.body) {
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch (parseError) {
        // If parsing fails, try to get fileId from query params or body as-is
        if (req.query.fileId) {
          body = { fileId: req.query.fileId as string };
        } else {
          body = typeof req.body === 'object' ? req.body : {};
        }
      }
    } else if (req.query.fileId) {
      // Fallback to query params
      body = { fileId: req.query.fileId as string };
    }

    const fileId = body.fileId || (body.src ? extractFileIdFromUrl(body.src) : null);

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'FileId is required. Provide either fileId or src in request body.',
        code: 'MISSING_FILE_ID',
      });
    }

    await imagekit.deleteFile(fileId);

    return res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
      fileId,
    });
  } catch (error: any) {
    console.error('Error deleting video from ImageKit:', error);

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
      message: error.message || 'Failed to delete video',
      code: 'DELETE_FAILED',
    });
  }
}

