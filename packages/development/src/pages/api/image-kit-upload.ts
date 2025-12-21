import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import ImageKit from 'imagekit';

export const config = {
  api: {
    bodyParser: false,
  },
};

type UploadResult = {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  fileId?: string;
  name?: string;
  filePath?: string;
  thumbnailUrl?: string;
};

type ErrorResponse = {
  message: string;
  code?: string;
  status?: number;
};

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResult | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Validate credentials
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    return res.status(500).json({
      message: 'ImageKit credentials are not configured',
      code: 'MISSING_CREDENTIALS',
    });
  }

  try {
    // Parse multipart/form-data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    // Get the file
    const fileArray = files.file || files.image;
    const fileField = fileArray?.[0] || (Object.values(files)[0] as formidable.File[])?.[0];

    if (!fileField) {
      return res.status(400).json({
        message: 'No file provided',
        code: 'NO_FILE',
      });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(fileField.filepath);
    const fileName = fileField.originalFilename || `image-${Date.now()}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer, // Buffer or base64 string
      fileName: fileName,
      folder: '/yoopta-uploads', // Optional: organize in folders
      useUniqueFileName: true, // Add unique suffix
      tags: ['yoopta-editor'], // Optional: add tags
    });

    // Clean up temporary file
    fs.unlinkSync(fileField.filepath);

    // Return result
    const result: UploadResult = {
      url: uploadResponse.url,
      width: uploadResponse.width,
      height: uploadResponse.height,
      size: uploadResponse.size,
      format: uploadResponse.fileType,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      filePath: uploadResponse.filePath,
      thumbnailUrl: uploadResponse.thumbnailUrl,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);

    // Clean up temporary file if it exists
    try {
      const form = formidable({});
      const [, files] = await form.parse(req);
      const fileField = (Object.values(files)[0] as formidable.File[])?.[0];
      if (fileField?.filepath && fs.existsSync(fileField.filepath)) {
        fs.unlinkSync(fileField.filepath);
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
}
