import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';
import { v4 as uuid } from 'uuid';
import path from 'path';

export async function uploadEventImage(file: Express.Multer.File) {
  const ext = path.extname(file.originalname) || '.jpg';
  const key = `event/${uuid()}${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
