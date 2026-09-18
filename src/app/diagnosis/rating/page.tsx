"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useMemo,
  useState,
} from "react";
import { songs } from "@/data/songs";
import type {
  DifficultyKey,
  Singability,
  SongRating,
} from "@/lib/diagnosis";

const difficultyItems: {
  key: DifficultyKey;
  label: string;
  description: string;
  requiresFalsetto?: boolean;
}[] = [
  {
    key: "highestNote",
    label: "地声高音",
    description:
      "地声の高い音が出しにくい",
  },
  {
    key: "lowestNote",
    label: "地声低音",
    description:
      "低い地声が出しにくい",
  },
  {
    key: "falsettoHighestNote",
    label: "裏声高音",
    description:
      "高い裏声が出しにくい",
    requiresFalsetto: true,
  },
  {
    key: "falsettoLowestNote",
    label: "裏声低音",
    description:
      "低い裏声が出しにくい",
    requiresFalsetto: true,
  },
  {
    key: "voiceSwitch",
    label: "地声↔裏声切り替え",
    description:
      "地声と裏声の切り替えが難しい",
    requiresFalsetto: true,
  },
  {
    key: "highNoteFrequency",
    label: "地声高音の連発",
    description:
      "高い地声が何度も続くとつらい",
  },
  {
    key: "highNoteLongTone",
    label: "地声高音ロングトーン",
    description:
      "高い地声を長く伸ばすのがつらい",
  },
  {
    key: "breath",
    label: "ブレス",
    description:
      "息が続きにくい",
  },
  {
    key: "fastLyrics",
    label: "滑舌",
    description:
      "速い・言葉数の多い部分が歌いにくい",
  },
  {
    key: "pitchMovement",
    label: "音程変化",
    description:
      "音程の上下や細かい動きが難しい",
  },
  {
    key: "rhythm",
    label: "リズム",
    description:
      "リズムを取るのが難しい",
  },
];

const singabilityOptions: {
  value: Singability;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: 1,
    label: "かなり苦手",
    description: "かなり歌いにくい",
    emoji: "😵",
  },
  {
    value: 2,
    label: "あまり歌えない",
    description: "苦しい部分が多い",
    emoji: "😣",
  },
  {
    value: 3,
    label: "なんとか歌える",
    description: "難しい部分もある",
    emoji: "🙂",
  },
  {
    value: 4,
    label: "だいたい歌える",
    description:
      "少し難しい部分はある",
    emoji: "😊",
  },
  {
    value: 5,
    label: "気持ちよく歌える",
    description:
      "余裕を持って歌える",
    emoji: "😆",
  },
];

const keyOptions = [
  "原キー",
  "-1",
  "-2",
  "-3",
  "-4",
  "-5",
  "-6",
  "+1",
  "+2",
  "+3",
  "+4",
  "+5",
  "+6",
  "わからない",
];

type RatingState =
  SongRating & {
    singabilitySelected: boolean;
  };

function createInitialRating(
  songId: string,
): RatingState {
  return {
    songId,
    keyChange: "",
    singability: 3,
    singabilitySelected: false,
    difficultPoints: [],
  };
}

export default function DiagnosisRatingPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const selectedIds = useMemo(() => {
    const raw =
      searchParams.get("songs");

    if (!raw) {
      return [];
    }

    return raw
      .split(",")
      .filter((id) =>
        songs.some(
          (song) => song.id === id,
        ),
      )
      .slice(0, 5);
  }, [searchParams]);

  const selectedSongs = useMemo(
    () =>
      selectedIds
        .map((id) =>
          songs.find(
            (song) => song.id === id,
          ),
        )
        .filter(
          (
            song,
          ): song is (typeof songs)[number] =>
            song !== undefined,
        ),
    [selectedIds],
  );

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [ratings, setRatings] =
    useState<RatingState[]>(() =>
      selectedIds.map(
        createInitialRating,
      ),
    );

  const currentSong =
    selectedSongs[currentIndex];

  const currentRating =
    ratings[currentIndex];

  const visibleDifficultyItems =
    useMemo(() => {
      if (!currentSong) {
        return [];
      }

      const usesFalsetto =
        currentSong.falsettoHighestNote !==
          null &&
        currentSong.falsettoLowestNote !==
          null;

      return difficultyItems.filter(
        (item) =>
          !item.requiresFalsetto ||
          usesFalsetto,
      );
    }, [currentSong]);

  function updateCurrentRating(
    updater: (
      rating: RatingState,
    ) => RatingState,
  ) {
    setRatings((current) =>
      current.map(
        (rating, index) =>
          index === currentIndex
            ? updater(rating)
            : rating,
      ),
    );
  }

  function setKeyChange(
    value: string,
  ) {
    updateCurrentRating(
      (rating) => ({
        ...rating,
        keyChange: value,
      }),
    );
  }

  function setSingability(
    value: Singability,
  ) {
    updateCurrentRating(
      (rating) => ({
        ...rating,
        singability: value,
        singabilitySelected: true,
      }),
    );
  }

  function toggleDifficultyPoint(
    key: DifficultyKey,
  ) {
    updateCurrentRating(
      (rating) => {
        const isSelected =
          rating.difficultPoints.includes(
            key,
          );

        if (isSelected) {
          return {
            ...rating,
            difficultPoints:
              rating.difficultPoints.filter(
                (item) =>
                  item !== key,
              ),
          };
        }

        return {
          ...rating,
          difficultPoints: [
            ...rating.difficultPoints,
            key,
          ],
        };
      },
    );
  }

  const canMoveNext =
    Boolean(
      currentRating?.keyChange,
    ) &&
    Boolean(
      currentRating?.singabilitySelected,
    );

  const isLastSong =
    currentIndex ===
    selectedSongs.length - 1;

  function goNext() {
    if (
      !canMoveNext ||
      isLastSong
    ) {
      return;
    }

    setCurrentIndex(
      (current) => current + 1,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goBack() {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex(
      (current) => current - 1,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function finishDiagnosis() {
    if (!canMoveNext) {
      return;
    }

    const completedRatings: SongRating[] =
      ratings.map((rating) => ({
        songId: rating.songId,
        keyChange:
          rating.keyChange,
        singability:
          rating.singability,
        difficultPoints:
          rating.difficultPoints,
      }));

    sessionStorage.setItem(
      "uta-match-diagnosis-ratings",
      JSON.stringify(
        completedRatings,
      ),
    );

    router.push(
      "/diagnosis/result",
    );
  }

  if (
    selectedSongs.length !== 5 ||
    ratings.length !== 5 ||
    !currentSong ||
    !currentRating
  ) {
    return (
      <main className="min-h-screen bg-white text-zinc-900">
        <header className="border-b border-blue-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <Link
              href="/"
              className="text-xl font-black text-blue-600"
            >
              UTA-MATCH
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="text-5xl">
            🎤
          </div>

          <h1 className="mt-6 text-2xl font-black">
            5曲を選択してください
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-500">
            歌唱タイプ診断を始めるには、
            歌ったことのある曲を5曲選ぶ必要があります。
          </p>

          <Link
            href="/diagnosis"
            className="mt-7 inline-flex rounded-full bg-blue-600 px-7 py-3 font-bold text-white"
          >
            曲を選ぶ
          </Link>
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
            曲を選び直す
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-10 md:pb-12 md:pt-12">
          <p className="text-sm font-bold tracking-[0.2em] text-blue-600">
            SINGING TYPE DIAGNOSIS
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
              STEP 2
            </span>

            <span className="text-sm font-bold text-zinc-400">
              5曲を評価
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black md:text-4xl">
            実際に歌った感覚を教えてください
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-500">
            普段カラオケで歌ったときの感覚でOK。
            5曲の回答から、あなたの歌唱タイプを分析します。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-zinc-500">
              {currentIndex + 1} /{" "}
              {selectedSongs.length}
              曲目
            </p>

            <p className="text-sm font-black text-blue-600">
              {Math.round(
                ((currentIndex + 1) /
                  selectedSongs.length) *
                  100,
              )}
              %
            </p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    selectedSongs.length) *
                  100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black tracking-widest text-blue-500">
            SONG {currentIndex + 1}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {currentSong.title}
          </h2>

          <p className="mt-2 font-medium text-zinc-500">
            {currentSong.artist}
          </p>

          <div className="mt-9 border-t border-zinc-100 pt-8">
            <p className="text-xs font-black text-blue-600">
              Q1
            </p>

            <h3 className="mt-2 text-lg font-black">
              普段はどのキーで歌いますか？
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              一番よく使うキーを選んでください。
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {keyOptions.map(
                (option) => {
                  const isSelected =
                    currentRating.keyChange ===
                    option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setKeyChange(
                          option,
                        )
                      }
                      className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-300"
                      }`}
                    >
                      {option}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="mt-9 border-t border-zinc-100 pt-8">
            <p className="text-xs font-black text-blue-600">
              Q2
            </p>

            <h3 className="mt-2 text-lg font-black">
              この曲はどれくらい歌えますか？
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              音が出るかだけでなく、
              1曲を通して歌ったときの感覚で選んでください。
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              {singabilityOptions.map(
                (item) => {
                  const isSelected =
                    currentRating.singabilitySelected &&
                    currentRating.singability ===
                      item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setSingability(
                          item.value,
                        )
                      }
                      className={`rounded-2xl border px-3 py-5 text-center transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                          : "border-zinc-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="text-2xl">
                        {item.emoji}
                      </div>

                      <div
                        className={`mt-2 text-xl font-black ${
                          isSelected
                            ? "text-blue-600"
                            : "text-zinc-800"
                        }`}
                      >
                        {item.value}
                      </div>

                      <p
                        className={`mt-2 text-xs font-black leading-5 ${
                          isSelected
                            ? "text-blue-700"
                            : "text-zinc-700"
                        }`}
                      >
                        {item.label}
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-zinc-400">
                        {
                          item.description
                        }
                      </p>
                    </button>
                  );
                },
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-bold text-zinc-400">
              <span>← 苦手</span>
              <span>
                気持ちよく歌える →
              </span>
            </div>
          </div>

          <div className="mt-9 border-t border-zinc-100 pt-8">
            <p className="text-xs font-black text-blue-600">
              Q3
            </p>

            <h3 className="mt-2 text-lg font-black">
              特に難しいと感じるポイントは？
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              複数選択できます。
              特になければ何も選ばなくてOKです。
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {visibleDifficultyItems.map(
                (item) => {
                  const isSelected =
                    currentRating.difficultPoints.includes(
                      item.key,
                    );

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        toggleDifficultyPoint(
                          item.key,
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-zinc-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-black ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-zinc-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </div>

                        <div>
                          <p
                            className={`font-black ${
                              isSelected
                                ? "text-blue-700"
                                : "text-zinc-800"
                            }`}
                          >
                            {item.label}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            {
                              item.description
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                },
              )}
            </div>

            {currentRating
              .difficultPoints
              .length === 0 && (
              <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-3">
                <p className="text-xs font-bold text-zinc-400">
                  難しいポイント：特になし
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 flex items-center justify-between gap-4">
          {currentIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-600 transition hover:border-blue-300"
            >
              ← 前の曲
            </button>
          ) : (
            <div />
          )}

          {!isLastSong ? (
            <button
              type="button"
              disabled={
                !canMoveNext
              }
              onClick={goNext}
              className={`rounded-full px-7 py-3 text-sm font-black transition ${
                canMoveNext
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400"
              }`}
            >
              次の曲 →
            </button>
          ) : (
            <button
              type="button"
              disabled={
                !canMoveNext
              }
              onClick={
                finishDiagnosis
              }
              className={`rounded-full px-7 py-3 text-sm font-black transition ${
                canMoveNext
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400"
              }`}
            >
              診断結果を見る →
            </button>
          )}
        </section>
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