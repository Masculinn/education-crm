import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const JWTSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  headers: {
    Authorization: `Bearer ${JWTSecret}`,
  },
});
