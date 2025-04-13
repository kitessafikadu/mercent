import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<string> {
    // console.log('Uploaded file:', file);
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded or file is invalid.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
