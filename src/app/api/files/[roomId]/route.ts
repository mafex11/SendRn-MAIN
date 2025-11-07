import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { UTApi } from 'uploadthing/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const utapi = new UTApi();

const isUploadThingEnabled = () => Boolean(process.env.UPLOADTHING_TOKEN);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    console.log('Fetching files for room ID:', roomId);
    console.log('Using prefix:', `rooms/${roomId}`);

    if (isUploadThingEnabled()) {
      const collectedFiles: {
        name: string;
        size: number;
        customId: string | null;
        key: string;
        id: string;
        status: string;
        uploadedAt: number;
      }[] = [];

      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await utapi.listFiles({ limit: 200, offset });
        collectedFiles.push(...response.files);
        hasMore = response.hasMore;
        offset += response.files.length;

        if (!hasMore || response.files.length === 0) {
          break;
        }
      }

      const relevantFiles = collectedFiles.filter((file) =>
        file.customId?.startsWith(`${roomId}__`)
      );

      if (relevantFiles.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const keys = relevantFiles.map((file) => file.key);
      const urlResponse = await utapi.getFileUrls(keys);
      const urlByKey = new Map(urlResponse.data.map((entry) => [entry.key, entry.url]));

      const normalized = relevantFiles.map((file) => ({
        public_id: file.key,
        secure_url:
          urlByKey.get(file.key) ?? `https://utfs.io/f/${file.key}`,
        original_filename: file.name,
        format: file.name.includes('.') ? file.name.split('.').pop() : undefined,
        bytes: file.size,
        created_at: new Date(file.uploadedAt).toISOString(),
        roomId,
        custom_id: file.customId,
      }));

      console.log('UploadThing files:', normalized);
      return NextResponse.json(normalized, { status: 200 });
    }

    // Fetch all resource types
    const [rawFiles, imageFiles, videoFiles] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        prefix: `rooms/${roomId}`,
        max_results: 100,
        resource_type: 'raw',
      }),
      cloudinary.api.resources({
        type: 'upload',
        prefix: `rooms/${roomId}`,
        max_results: 100,
        resource_type: 'image',
      }),
      cloudinary.api.resources({
        type: 'upload',
        prefix: `rooms/${roomId}`,
        max_results: 100,
        resource_type: 'video',
      }),
    ]);

    const allFiles = [
      ...rawFiles.resources,
      ...imageFiles.resources,
      ...videoFiles.resources,
    ];

    console.log('Raw files:', rawFiles.resources);
    console.log('Image files:', imageFiles.resources);
    console.log('Video files:', videoFiles.resources);
    console.log('All files combined:', allFiles);
    return NextResponse.json(allFiles, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}