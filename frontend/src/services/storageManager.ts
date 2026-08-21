import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'app-files';

/**
 * Uploads a file to a specified path in Supabase Storage.
 * Generates a unique filename using timestamp/UUID to avoid collisions if no specific filename is required.
 */
export const uploadFile = async (
  file: File, 
  path: string, 
  useOriginalName: boolean = false
): Promise<string> => {
  // If Supabase URL isn't configured properly, mock the upload
  if (!(supabase as any).supabaseUrl || (supabase as any).supabaseUrl === 'https://ahvsinxbmpnczzobgjpm.supabase.co/rest/v1/') {
    console.warn('Supabase not properly configured with real credentials yet. Mocking file upload.');
    return URL.createObjectURL(file);
  }

  const fileName = useOriginalName ? file.name : `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
  const fullPath = `${path}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    return data.path;
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    throw new Error('Failed to upload file.');
  }
};

export const storageManager = {
  /**
   * Uploads an image for a specific product scan to /{userId}/product_scans/{scanId}/
   */
  uploadScanImage: async (file: File, userId: string, scanId: string): Promise<string> => {
    return uploadFile(file, `${userId}/product_scans/${scanId}`, false);
  },

  /**
   * Fetches a signed URL for an image path to display it in the UI (for private buckets)
   */
  getSignedImageUrl: async (path: string, expiresInSeconds: number = 3600): Promise<string> => {
    // If it's a mock object URL, return it directly
    if (path.startsWith('blob:')) return path;

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(path, expiresInSeconds);
      
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL from Supabase:', error);
      return '';
    }
  },

  /**
   * Securely removes a file from the Supabase Storage bucket
   */
  deleteFile: async (path: string): Promise<void> => {
    // Ignore mock object URLs
    if (path.startsWith('blob:') || !path) return;

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file from Supabase:', error);
    }
  }
};
