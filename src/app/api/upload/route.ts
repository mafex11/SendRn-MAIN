import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { UTApi, UTFile } from 'uploadthing/server';
import { randomUUID } from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const utapi = new UTApi();

const isUploadThingEnabled = () => Boolean(process.env.UPLOADTHING_TOKEN);

type UploadThingSuccessPayload = {
  data: {
    key: string;
    url: string;
    name: string;
    size: number;
    uploadedAt?: number;
  };
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const roomId = formData.get('roomId');

    if (!(file instanceof File)) {
      throw new Error('Missing file');
    }

    if (typeof roomId !== 'string' || roomId.length === 0) {
      throw new Error('Missing room identifier');
    }

    console.log('Uploading file to room:', roomId);
    console.log('Original file name:', file.name);

    if (isUploadThingEnabled()) {
      const fileBuffer = await file.arrayBuffer();
      const uploadKey = `${roomId}__${randomUUID()}`;
      const utFile = new UTFile([fileBuffer], file.name, {
        type: file.type,
        lastModified: file.lastModified,
        customId: uploadKey,
      });

      const uploadResult = await utapi.uploadFiles(utFile);
      const normalizedResult = Array.isArray(uploadResult)
        ? uploadResult
        : [uploadResult];

      const success = normalizedResult.find(
        (entry): entry is UploadThingSuccessPayload =>
          !!entry && 'data' in entry && typeof entry.data?.key === 'string'
      );

      if (!success) {
        console.error('UploadThing reported an error', normalizedResult);
        throw new Error('Upload failed');
      }

      const {
        key,
        url,
        name,
        size,
        uploadedAt,
      } = success.data;

      const payload = {
        public_id: key,
        secure_url: url,
        original_filename: name,
        format: name.includes('.') ? name.split('.').pop() : undefined,
        bytes: size,
        created_at: new Date(uploadedAt ?? Date.now()).toISOString(),
        roomId,
      };

      console.log('UploadThing upload result:', payload);
      return NextResponse.json(payload, { status: 200 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          upload_preset: 'senddown',
          folder: `rooms/${roomId}`,
          // Remove public_id to let Cloudinary generate a unique one
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    console.log('Cloudinary upload result:', result);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}