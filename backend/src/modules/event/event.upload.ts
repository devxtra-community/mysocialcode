
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';
import { env } from '../../config/env';

console.log('R2_PUBLIC_URL =', env.R2_PUBLIC_URL);

export async function uploadEventImage(file: Express.Multer.File) {
  console.log('R2_PUBLIC_URL at startup:', env.R2_PUBLIC_URL);
  const key = `event/${Date.now()}-${file.originalname}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return `${env.R2_PUBLIC_URL}/${key}`;

  if (!env.R2_PUBLIC_URL) {
    throw new Error('R2_PUBLIC_URL is not defined');
  }
}
