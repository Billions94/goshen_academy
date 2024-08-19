import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
dotenv.config();

export type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (_req: Request, file: Express.Multer.File) => {
    return {
      folder: 'Goshen academy',
      resource_type: 'auto',
      use_filename: true,
      public_id: file.originalname.split('.')[0], // Use the original file name without extension
    };
  },
});

export const multerOptions = () => ({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 100000000, // 10000000 Bytes = 100 MB
  },
  fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    // filter format
    if (
      !file.originalname.match(/\.(jpeg|png|mov|gif|heic|jpg|mp4|MPEG-4|mkv)$/)
    ) {
      return cb(
        new Error(
          'Accepted file types: jpeg, png, gif, heic, jpg, mp4, MPEG-4, mkv'
        )
      );
    }
    cb(null, true);
  },
});
