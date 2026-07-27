import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경변수가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요."
  );
}

// anon(공개) key만 사용하는 클라이언트입니다.
// 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 동일하게 사용합니다.
export function getSupabaseClient() {
  return createClient(supabaseUrl!, supabaseAnonKey!);
}
