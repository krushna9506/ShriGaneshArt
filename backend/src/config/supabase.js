// Updated for free deployment: Vercel + Render + Neon
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default supabase;

export async function uploadFile(bucket, filePath, fileBuffer, mimeType) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  return urlData.publicUrl;
}
