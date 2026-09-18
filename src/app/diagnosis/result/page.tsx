"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  calculateDiagnosis,
  type DiagnosisResult,
  type SongRating,
} from "@/lib/diagnosis";

function ScoreBar({
  score,
}: {
  score: number;
}) {
  const percentage =
    (score / 5) * 100;

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
      <div
        className="h-full rounded-full bg-blue-600"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}

export default function DiagnosisResultPage() {
  const [result, setResult] =
    useState<DiagnosisResult | null>(
      null,
    );

  const [hasData, setHasData] =
    useState(true);

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
      const ratings = JSON.parse(
        stored,
      ) as SongRating[];

      if (
        !Array.isArray(ratings) ||
        ratings.length !== 5
      ) {
        setHasData(false);
        return;
      }

      const diagnosis =
        calculateDiagnosis(ratings);

      setResult(diagnosis);
    } catch {
      setHasData(false);
    }
  }, []);

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
            診断データがありません
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-500">
            5曲を選んで、
            歌唱タイプ診断を行ってください。
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

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-4xl">
            🎤
          </div>

          <p className="mt-4 text-sm font-bold text-zinc-500">
            あなたの歌唱タイプを分析中...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-blue-600"
          >
            UTA-MATCH
          </Link>

          <Link
            href="/diagnosis"
            className="text-sm font-bold text-blue-600"
          >
            もう一度診断
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-b from-blue-50 via-blue-50/50 to-white">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-12 text-center md:pt-16">
          <p className="text-sm font-black tracking-[0.2em] text-blue-600">
            YOUR SINGING TYPE
          </p>

          <div className="mt-8 text-7xl">
            {result.type.emoji}
          </div>

          <p className="mt-7 text-sm font-black text-blue-600">
            あなたの歌唱タイプは...
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            {result.type.name}
          </h1>

          <p className="mt-4 text-lg font-bold text-zinc-600">
            {result.type.catchphrase}
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-500">
            {result.type.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6">
            <p className="text-xs font-black tracking-widest text-blue-500">
              TOTAL BALANCE
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-black text-blue-600">
                {result.averageScore}
              </span>

              <span className="pb-1 text-sm font-bold text-zinc-400">
                / 5.0
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              11項目から見た現在の歌唱プロフィール
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-black tracking-widest text-zinc-400">
              ANALYSIS CONFIDENCE
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-black">
                {
                  result.averageConfidence
                }
              </span>

              <span className="pb-1 text-sm font-bold text-zinc-400">
                %
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              評価する曲が増えるほど診断精度が高まります
            </p>
          </div>
        </section>

        <section className="mt-10">
          <p className="text-xs font-black tracking-[0.2em] text-blue-600">
            VOCAL PROFILE
          </p>

          <h2 className="mt-2 text-2xl font-black">
            あなたの歌唱プロフィール
          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            選んだ5曲の音域・歌唱負荷と、
            実際に歌った感覚から11項目を推定しています。
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {result.abilities.map(
              (ability) => (
                <div
                  key={ability.key}
                  className="rounded-2xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black">
                        {ability.label}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-zinc-400">
                        {
                          ability.description
                        }
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-2xl font-black text-blue-600">
                        {ability.score}
                      </span>

                      <span className="ml-1 text-xs font-bold text-zinc-400">
                        / 5
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ScoreBar
                      score={
                        ability.score
                      }
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400">
                      推定信頼度
                    </span>

                    <span className="text-[11px] font-black text-zinc-500">
                      {
                        ability.confidence
                      }
                      %
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-zinc-950 p-7 text-white md:p-9">
          <p className="text-xs font-black tracking-[0.2em] text-blue-300">
            YOUR MATCH
          </p>

          <h2 className="mt-3 text-2xl font-black">
            じゃあ、何を歌えばいい？
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-300">
            あなたの11項目の歌唱プロフィールと推定快適音域から、
            Uta-Matchが相性のいい曲とおすすめキーを計算します。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/recommendations"
              className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-500"
            >
              あなたに合う曲を見る →
            </Link>

            <Link
              href="/search"
              className="inline-flex rounded-full border border-zinc-700 px-6 py-3 text-sm font-bold text-white"
            >
              条件から探す
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-400">
          現在の診断結果は5曲の回答から推定したものです。
          今後、評価曲を増やすことでプロフィールをさらに精密化できます。
        </p>
      </div>

      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm font-black text-blue-600">
            UTA-MATCH
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            自分の声に、歌える曲をマッチ。
          </p>
        </div>
      </footer>
    </main>
  );
}