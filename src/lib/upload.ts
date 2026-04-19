import { supabase } from './supabase';

/**
 * Uploads an array of files to Supabase Storage in the 'books' bucket.
 * Generates unique filenames using timestamp + original name.
 * Returns an array of public URLs.
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const BUCKET_NAME = 'books';
  console.log("--- Supabase Upload Debug Start ---");
  console.log("Bucket target:", BUCKET_NAME);
  console.log("Files to upload:", files.map(f => f.name));

  if (!supabase) {
    console.error("Supabase client is not initialized!");
    throw new Error("Supabase client not initialized. Check your configuration.");
  }

  // Perform Uploads
  const uploadPromises = files.map(async (file) => {
    try {
      const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, '');
      const fileName = `${Date.now()}_${sanitizedName}`;
      const filePath = `${fileName}`;

      console.log(`[${file.name}] Uploading to ${BUCKET_NAME}/${filePath}`);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`[${file.name}] Supabase Upload Error:`, error);
        
        // Attempt to diagnose by listing buckets
        let bucketListMessage = "";
        try {
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          if (listError) {
            console.error("Failed to list buckets for diagnosis:", listError);
            bucketListMessage = `(Could not list buckets: ${listError.message})`;
          } else if (buckets) {
            const bucketNames = buckets.map(b => b.name);
            console.log("Diagnosis - Available buckets:", bucketNames);
            bucketListMessage = `(Available buckets: ${bucketNames.join(', ') || 'none'})`;
          }
        } catch (diagErr) {
          console.error("Diagnosis attempt crashed:", diagErr);
        }

        if (error.message?.toLowerCase().includes('bucket not found') || (error as any).status === 400) {
          throw new Error(`Bucket '${BUCKET_NAME}' not found in Supabase. ${bucketListMessage}`);
        }
        
        throw new Error(`Upload failed for ${file.name}: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      console.log(`[${file.name}] Success! URL: ${publicUrl}`);
      return publicUrl;
    } catch (err: any) {
      console.error(`[${file.name}] Individual upload processing failed:`, err);
      throw err;
    }
  });

  try {
    const urls = await Promise.all(uploadPromises);
    console.log("--- Supabase Upload Debug End (SUCCESS) ---");
    return urls;
  } catch (err: any) {
    console.error("--- Supabase Upload Debug End (FAILED) ---");
    console.error("Batch error details:", err);
    throw new Error(err.message || "Image upload failed. Please verify your Supabase Storage bucket and policies.");
  }
};
