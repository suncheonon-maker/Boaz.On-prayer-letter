"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

// 같은 브라우저에서 중복으로 여러 번 누르지 않도록 표시해두는 로컬 저장 키입니다.
// (기기/브라우저별 저장이라 완벽한 중복 방지는 아니며, 단순 UX 개선용입니다.)
const STORAGE_KEY = "prayer-letter:has-prayed";

export default function PrayerButton() {
  const [count, setCount] = useState<number | null>(null);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    supabase
      .from("prayers")
      .select("*", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (!error) setCount(count ?? 0);
      });

    if (typeof window !== "undefined") {
      // 서버 렌더링 시점엔 localStorage가 없으므로, 하이드레이션 불일치를 피하려면
      // 마운트 이후(effect)에만 값을 읽어와야 합니다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasPrayed(window.localStorage.getItem(STORAGE_KEY) === "1");
    }

    const channel = supabase
      .channel("prayers-count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "prayers" },
        () => {
          setCount((prev) => (prev ?? 0) + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleClick() {
    if (hasPrayed || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("prayers").insert({});

    setSubmitting(false);

    if (error) {
      setErrorMessage("잠시 후 다시 시도해주세요.");
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, "1");
    setHasPrayed(true);
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-3 border-t border-stone-200 pt-6">
      <button
        type="button"
        onClick={handleClick}
        disabled={hasPrayed || submitting}
        className={`w-full max-w-xs rounded-full px-6 py-3 text-base font-semibold transition sm:w-auto ${
          hasPrayed
            ? "cursor-default bg-rose-50 text-rose-500 ring-1 ring-inset ring-rose-200"
            : "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 disabled:opacity-60"
        }`}
      >
        {hasPrayed ? "🙏 함께 기도하고 있어요" : "🙏 기도로 동역하기"}
      </button>

      <p className="text-sm text-stone-500">
        {count === null
          ? "동역자 수를 불러오는 중..."
          : `현재 ${count.toLocaleString("ko-KR")}명이 기도로 동역하고 있습니다`}
      </p>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
