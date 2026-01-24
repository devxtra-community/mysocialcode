import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';
export async function uploadEventImage(file: Express.Multer.File) {
  const key = `event/${Date.now()}-${file.originalname}`;

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
