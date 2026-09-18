"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SongRating } from "@/lib/diagnosis";
import {
  calculateSongMatches,
  getRecommendedKeyLabel,
  inferRangeProfile,
  type SongMatch,
} from "@/lib/matching";

type Mode = "original" | "key-change";

function MatchBadge({
  score,
}: {
  score: number;
}) {
  let label = "チャレンジ";

  if (score >= 90) {
    label = "かなり合いそう";
  } else if (score >= 80) {
    label = "合いそう";
  } else if (score >= 70) {
    label = "まずまず";
  }

  return (
    <div className="text-right">
      <div className="flex items-baseline justify-end gap-1">
        <span className="text-3xl font-black text-blue-600">
          {score}
        </span>

        <span className="text-sm font-black text-blue-500">
          %
        </span>
      </div>

      <p className="mt-1 text-[11px] font-bold text-zinc-400">
        {label}
      </p>
    </div>
  );
}

function ReasonIcon({
  type,
}: {
  type: "good" | "warning" | "bad";
}) {
  if (type === "good") {
    return (
      <span className="font-black text-blue-600">
        ◎
      </span>
    );
  }

  if (type === "warning") {
    return (
      <span className="font-black text-amber-500">
        △
      </span>
    );
  }

  return (
    <span className="font-black text-red-500">
      ×
    </span>
  );
}

export default function RecommendationsPage() {
  const [ratings, setRatings] =
    useState<SongRating[] | null>(
      null,
    );

  const [hasData, setHasData] =
    useState(true);

  const [mode, setMode] =
    useState<Mode>("original");

  useEffect(() => {
    const stored =
      sessionStorage.getItem(
        "uta-match-diagnosis-ratings",
      );

    if (!stored) {
      setHasData(false);
      return;
    }

    try {
      const parsed = JSON.parse(
        stored,
      ) as SongRating[];

      if (
        !Array.isArray(parsed) ||
        parsed.length !== 5
      ) {
        setHasData(false);
        return;
      }

      setRatings(parsed);
    } catch {
      setHasData(false);
    }
  }, []);

  const matches: SongMatch[] =
    useMemo(() => {
      if (!ratings) {
        return [];
      }

      return calculateSongMatches(
        ratings,
        mode === "key-change",
      );
    }, [ratings, mode]);

  const rangeProfile =
    useMemo(() => {
      if (!ratings) {
        return null;
      }

      return inferRangeProfile(
        ratings,
      );
    }, [ratings]);

  if (!hasData) {
    return (
      <main className="min-h-screen bg-white text-zinc-900">
        <header className="border-b border-blue-100">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <Link
              href="/"
              className="text-xl font-black text-blue-600"
            >
              UTA-MATCH
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="text-5xl">
            🎤
          </div>

          <h1 className="mt-6 text-2xl font-black">
            まず歌唱タイプを診断しよう
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-500">
            あなたとの相性を計算するには、
            5曲の歌唱データが必要です。
          </p>

          <Link
            href="/diagnosis"
            className="mt-7 inline-flex rounded-full bg-blue-600 px-7 py-3 font-black text-white"
          >
            診断をはじめる
          </Link>
        </div>
      </main>
    );
  }

  if (!ratings || !rangeProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-bold text-zinc-500">
          あなたに合う曲を分析中...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-blue-600"
          >
            UTA-MATCH
          </Link>

          <Link
            href="/diagnosis/result"
            className="text-sm font-bold text-blue-600"
          >
            診断結果
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-5xl px-6 pb-12 pt-12">
          <p className="text-sm font-black tracking-[0.2em] text-blue-600">
            YOUR MATCHES
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            あなたに合う曲
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
            5曲の診断から推定したあなたの音域と歌唱能力を、
            Uta-Matchの楽曲データと比較しています。
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <div className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold">
              地声{" "}
              <span className="text-blue-600">
                {rangeProfile.groundLowest ??
                  "?"}
                {" ～ "}
                {rangeProfile.groundHighest ??
                  "?"}
              </span>
            </div>

            <div className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold">
              裏声{" "}
              <span className="text-blue-600">
                {rangeProfile.falsettoLowest ??
                  "?"}
                {" ～ "}
                {rangeProfile.falsettoHighest ??
                  "?"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <section className="sticky top-0 z-20 -mx-6 border-y border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-5xl rounded-2xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() =>
                setMode("original")
              }
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                mode === "original"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              原キーで歌える曲
            </button>

            <button
              type="button"
              onClick={() =>
                setMode("key-change")
              }
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                mode === "key-change"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              キー変更も含める
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.18em] text-blue-600">
                MATCH RANKING
              </p>

              <h2 className="mt-2 text-2xl font-black">
                相性が高い順
              </h2>
            </div>

            <p className="text-xs font-bold text-zinc-400">
              {matches.length}曲
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {matches.map(
              (match, index) => (
                <article
                  key={match.song.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-7"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-600">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/search/${match.song.id}`}
                          className="text-xl font-black hover:text-blue-600"
                        >
                          {match.song.title}
                        </Link>

                        <p className="mt-1 text-sm font-medium text-zinc-500">
                          {match.song.artist}
                        </p>
                      </div>
                    </div>

                    <MatchBadge
                      score={
                        match.matchScore
                      }
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
                      {mode ===
                      "key-change"
                        ? `おすすめキー ${getRecommendedKeyLabel(
                            match.recommendedKey,
                          )}`
                        : "原キー"}
                    </div>

                    <div className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-500">
                      推定信頼度{" "}
                      {match.confidence}%
                    </div>

                    <div className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-500">
                      難易度{" "}
                      {"★".repeat(
                        match.song
                          .difficulty,
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5">
                    {match.reasons.map(
                      (
                        reason,
                        reasonIndex,
                      ) => (
                        <div
                          key={`${match.song.id}-${reasonIndex}`}
                          className="flex items-start gap-3"
                        >
                          <ReasonIcon
                            type={
                              reason.type
                            }
                          />

                          <p className="text-sm leading-6 text-zinc-600">
                            {
                              reason.text
                            }
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/search/${match.song.id}`}
                      className="text-sm font-black text-blue-600"
                    >
                      曲の詳細を見る →
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-black text-blue-900">
            この相性％について
          </h2>

          <p className="mt-3 text-xs leading-6 text-blue-800/70">
            相性％は、診断した5曲から推定した快適音域と歌唱能力をもとに、
            各曲の音域・高音の連発・ロングトーン・ブレス・滑舌・
            音程変化・リズム・地声と裏声の切り替えなどを比較した
            Uta-Match独自の推定値です。
          </p>

          <p className="mt-2 text-xs leading-6 text-blue-800/70">
            発声方法や体調、オクターブ変更などによって実際の歌いやすさは変わります。
            今後、評価曲を増やすことで精度を高めていく想定です。
          </p>
        </section>
      </div>
    </main>
  );
}