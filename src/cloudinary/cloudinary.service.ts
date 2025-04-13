import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import { Multer } from 'multer';

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
  async uploadImage(file: Express.Multer.File, folder = 'uploads') {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
    });
    return result.secure_url;
  }
}
