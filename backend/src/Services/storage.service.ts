// // for signing urls for s3
// import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { env } from '../config/env';
// export const r2 = new S3Client({
//   region: 'auto',
//   endpoint: env.R2_ENDPOINT,
//     credentials: {
//     accessKeyId: env.R2_ACCESS_KEY_ID!,
//     secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
//   },
// });

// export async function getSignedUrl(key: string, expiresInSeconds = 3600) {
//   const command = new GetObjectCommand({
//     Bucket: env.R2_BUCKET_NAME!,
//     Key: key,
//   });

//     const url = await r2.getSignedUrl(command, { expiresIn: expiresInSeconds });
//     return url;
// }
