import { Platform } from 'react-native';

import { getAccessToken } from './supabase';

/**
 * Multipart upload, over XMLHttpRequest rather than fetch.
 *
 * Expo replaces the global fetch with a WinterCG implementation, and that one
 * refuses React Native's file shape outright — convertFormData throws
 * "Unsupported FormDataPart implementation" on any part carrying a `uri`,
 * which is the only shape a picked file has on a device. The request never
 * leaves the phone, so nothing reaches the server to fail loudly.
 *
 * React Native's own networking does understand that shape: FormData.getParts
 * turns {uri, name, type} into a file part, and XMLHttpRequest streams it from
 * disk instead of pulling the whole thing into memory first. On web the same
 * call takes a real File, which XMLHttpRequest handles natively too.
 */
export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export async function uploadMultipart<T>(
  path: string,
  file: UploadFile,
  fallbackError: string,
): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error('Please sign in to upload.');

  const body = new FormData();
  if (Platform.OS === 'web') {
    // The browser's FormData has no idea what {uri, name, type} means — it
    // stringifies the object and the server receives a text field, not a file.
    const blob = await (await fetch(file.uri)).blob();
    body.append('file', new File([blob], file.name, { type: file.type || blob.type }));
  } else {
    body.append('file', file as unknown as Blob);
  }

  const base = process.env.EXPO_PUBLIC_API_URL ?? 'https://legalx-backend-gl4b.onrender.com';

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${base}${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onload = () => {
      let parsed: { error?: string } = {};
      try {
        parsed = JSON.parse(xhr.responseText);
      } catch {
        // A proxy timing out returns HTML, not JSON.
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(parsed as T);
      else reject(new Error(parsed.error || fallbackError));
    };

    xhr.onerror = () => reject(new Error('Upload failed. Check your connection and try again.'));
    xhr.ontimeout = () => reject(new Error('That upload timed out. Please try again.'));

    xhr.send(body);
  });
}
