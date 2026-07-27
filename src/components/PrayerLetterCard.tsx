import type { Letter } from "@/lib/types";
import LetterGallery from "./LetterGallery";
import PrayerButton from "./PrayerButton";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export default function PrayerLetterCard({ letter }: { letter: Letter }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <LetterGallery images={letter.image_urls} alt={letter.title} />

      <div className="p-5 sm:p-8">
        <p className="text-sm text-stone-400">{formatDate(letter.created_at)}</p>
        <h2 className="mt-1 text-xl font-bold text-stone-800 sm:text-2xl">
          {letter.title}
        </h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">
          {letter.content}
        </p>

        <PrayerButton />
      </div>
    </article>
  );
}
