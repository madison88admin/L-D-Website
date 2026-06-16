import { supabase } from './supabase';

const siteImagesBucket = 'site-images';

function getImageBlob(file: File, maxSize = 900, quality = 0.82) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to read image file.'));
        return;
      }

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error('Unable to read image file.'));
    };

    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Unable to prepare image.'));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Unable to prepare image.'));
            return;
          }

          resolve(blob);
        },
        'image/jpeg',
        quality,
      );
    };

    image.onerror = () => {
      reject(new Error('Unable to load image file.'));
    };

    reader.readAsDataURL(file);
  });
}

function getImageDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to read image file.'));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error('Unable to read image file.'));
    };

    reader.readAsDataURL(blob);
  });
}

function getUniqueImagePath(folder: string) {
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, '-').replace(/^-+|-+$/g, '') || 'uploads';
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${safeFolder}/${id}.jpg`;
}

export async function uploadImageToStorage(file: File, folder: string) {
  const blob = await getImageBlob(file);

  if (!supabase) {
    return getImageDataUrl(blob);
  }

  const path = getUniqueImagePath(folder);
  const { error } = await supabase.storage
    .from(siteImagesBucket)
    .upload(path, blob, {
      cacheControl: '31536000',
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) {
    console.warn('Supabase Storage upload failed. Falling back to inline image data.', error);
    return getImageDataUrl(blob);
  }

  const { data } = supabase.storage.from(siteImagesBucket).getPublicUrl(path);
  return data.publicUrl;
}
