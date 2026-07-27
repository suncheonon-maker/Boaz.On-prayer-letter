import PrayerLetterCard from "@/components/PrayerLetterCard";
import { getSupabaseClient } from "@/lib/supabase";
import type { Letter } from "@/lib/types";

// 여기 두 줄만 바꾸면 페이지 상단 문구를 원하는 대로 수정할 수 있어요.
const SITE_TITLE = "기도편지";
const SITE_SUBTITLE = "사역 소식을 나누고 함께 기도로 동역해요";

// 60초마다 최신 데이터로 다시 렌더링합니다.
export const revalidate = 60;

export default async function Home() {
  const supabase = getSupabaseClient();
  const { data: letters } = await supabase
    .from("letters")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<Letter[]>();

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">
            {SITE_TITLE}
          </h1>
          <p className="mt-2 text-stone-500">{SITE_SUBTITLE}</p>
        </header>

        {letters && letters.length > 0 ? (
          <div className="flex flex-col gap-8">
            {letters.map((letter, index) => (
              <PrayerLetterCard
                key={letter.id}
                letter={letter}
                showPrayerButton={index === 0}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-stone-400 ring-1 ring-stone-200">
            아직 등록된 기도편지가 없습니다. Supabase Table Editor에서
            letters 테이블에 글을 추가해주세요.
          </p>
        )}
      </div>
    </main>
  );
}
