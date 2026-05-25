import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

cloudinary.config({
  cloud_name:  env.CLOUDINARY_CLOUD_NAME,
  api_key:     env.CLOUDINARY_API_KEY,
  api_secret:  env.CLOUDINARY_API_SECRET,
});

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export { cloudinary };
