import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();
export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ASSESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});
export const handleUploadFile = async (file: any) => {
  try {
    const fileBuffer = await sharp(file.buffer)
    .resize(768, 576, { fit: 'cover' })  // 壓縮尺寸
    .jpeg({ quality: 80 })             // 壓縮品質
    .toBuffer();
    const fileName = `${Date.now()}-${Buffer.from(file.originalname,'binary').toString()}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000'
    };
    await s3.send(new PutObjectCommand(uploadParams));
    const url = `${process.env.AWS_CLOUD_FRONT_URL}${fileName}`;
    return url;
  } catch (error) {
    throw new Error('上傳失敗');
  }
}
