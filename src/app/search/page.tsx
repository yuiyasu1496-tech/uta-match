"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { songs } from "@/data/songs";

const noteOrder = [
  "lowC",
  "lowC#",
  "lowD",
  "lowD#",
  "lowE",
  "lowF",
  "lowF#",
  "lowG",
  "lowG#",

  "mid1A",
  "mid1A#",
  "mid1B",
  "mid1C",
  "mid1C#",
  "mid1D",
  "mid1D#",
  "mid1E",
  "mid1F",
  "mid1F#",
  "mid1G",
  "mid1G#",

  "mid2A",
  "mid2A#",
  "mid2B",
  "mid2C",
  "mid2C#",
  "mid2D",
  "mid2D#",
  "mid2E",
  "mid2F",
  "mid2F#",
  "mid2G",
  "mid2G#",

  "hiA",
  "hiA#",
  "hiB",
  "hiC",
  "hiC#",
  "hiD",
  "hiD#",
  "hiE",
  "hiF",
  "hiF#",
  "hiG",
  "hiG#",

  "hihiA",
  "hihiA#",
  "hihiB",
  "hihiC",
];

const genres = Array.from(
  new Set(songs.map((song) => song.genre)),
).sort();

const releaseYears = Array.from(
  new Set(songs.map((song) => song.releaseYear)),
).sort((a, b) => a - b);

function Rating({
  value,
}: {
  value: number;
}) {
  return (
    <span
      className="text-lg tracking-wide text-blue-600"
      aria-label={`難易度 ${value} / 5`}
    >
      {"★".repeat(value)}

      <span className="text-blue-100">
        {"★".repeat(5 - value)}
      </span>
    </span>
  );
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [lowestNote, setLowestNote] = useState("");
  const [highestNote, setHighestNote] = useState("");
  const [falsettoHighestNote, setFalsettoHighestNote] =
    useState("");

  const [difficulty, setDifficulty] = useState("");

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    [],
  );

  const [releaseYearFrom, setReleaseYearFrom] = useState("");
  const [releaseYearTo, setReleaseYearTo] = useState("");

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      // 曲名・アーティスト検索
      if (keyword.trim()) {
        const searchText = keyword.trim().toLowerCase();

        const matchesKeyword =
          song.title.toLowerCase().includes(searchText) ||
          song.artist.toLowerCase().includes(searchText);

        if (!matchesKeyword) {
          return false;
        }
      }

      // 地声最低音
      if (lowestNote) {
        const songLowestIndex = noteOrder.indexOf(
          song.lowestNote,
        );

        const selectedLowestIndex =
          noteOrder.indexOf(lowestNote);

        if (
          songLowestIndex === -1 ||
          selectedLowestIndex === -1
        ) {
          return false;
        }

        if (songLowestIndex < selectedLowestIndex) {
          return false;
        }
      }

      // 地声最高音
      if (highestNote) {
        const songHighestIndex = noteOrder.indexOf(
          song.highestNote,
        );

        const selectedHighestIndex =
          noteOrder.indexOf(highestNote);

        if (
          songHighestIndex === -1 ||
          selectedHighestIndex === -1
        ) {
          return false;
        }

        if (songHighestIndex > selectedHighestIndex) {
          return false;
        }
      }

      // 裏声最高音
      if (falsettoHighestNote) {
        const songFalsettoIndex = noteOrder.indexOf(
          song.falsettoHighestNote,
        );

        const selectedFalsettoIndex =
          noteOrder.indexOf(falsettoHighestNote);

        if (
          songFalsettoIndex === -1 ||
          selectedFalsettoIndex === -1
        ) {
          return false;
        }

        if (
          songFalsettoIndex > selectedFalsettoIndex
        ) {
          return false;
        }
      }

      // 総合難易度
      if (difficulty) {
        if (song.difficulty > Number(difficulty)) {
          return false;
        }
      }

      // ジャンル
      // 複数選択時はOR検索
      if (selectedGenres.length > 0) {
        if (!selectedGenres.includes(song.genre)) {
          return false;
        }
      }

      // リリース年
      if (releaseYearFrom) {
        if (song.releaseYear < Number(releaseYearFrom)) {
          return false;
        }
      }

      if (releaseYearTo) {
        if (song.releaseYear > Number(releaseYearTo)) {
          return false;
        }
      }

      return true;
    });
  }, [
    keyword,
    lowestNote,
    highestNote,
    falsettoHighestNote,
    difficulty,
    selectedGenres,
    releaseYearFrom,
    releaseYearTo,
  ]);

  function toggleGenre(genre: string) {
    setSelectedGenres((current) => {
      if (current.includes(genre)) {
        return current.filter((item) => item !== genre);
      }

      return [...current, genre];
    });
  }

  function resetFilters() {
    setKeyword("");
    setLowestNote("");
    setHighestNote("");
    setFalsettoHighestNote("");
    setDifficulty("");
    setSelectedGenres([]);
    setReleaseYearFrom("");
    setReleaseYearTo("");
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
            href="/"
            className="text-sm font-bold text-blue-600"
          >
            ホーム
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-sm font-bold tracking-[0.2em] text-blue-600">
            SONG SEARCH
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            曲を探す
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-500">
            自分の声や歌いやすさに合わせて、
            <br className="md:hidden" />
            歌える曲を探そう。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <section className="-mt-2 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600">
              SEARCH FILTER
            </p>

            <h2 className="mt-2 text-2xl font-black">
              検索条件
            </h2>
          </div>

          <div className="mt-7 space-y-7">
            {/* 曲名・アーティスト */}
            <div>
              <label
                htmlFor="keyword"
                className="text-sm font-bold text-zinc-700"
              >
                曲名・アーティスト
              </label>

              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
                placeholder="曲名やアーティスト名を入力"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* 音域 */}
            <div>
              <h3 className="text-sm font-bold text-zinc-700">
                音域
              </h3>

              <div className="mt-3 grid gap-4 md:grid-cols-3">
                {/* 最低音 */}
                <div>
                  <label
                    htmlFor="lowestNote"
                    className="text-xs font-bold text-zinc-500"
                  >
                    地声最低音
                  </label>

                  <select
                    id="lowestNote"
                    value={lowestNote}
                    onChange={(event) =>
                      setLowestNote(event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">
                      指定なし
                    </option>

                    {noteOrder.map((note) => (
                      <option key={note} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-zinc-400">
                    この音以上の曲
                  </p>
                </div>

                {/* 最高音 */}
                <div>
                  <label
                    htmlFor="highestNote"
                    className="text-xs font-bold text-zinc-500"
                  >
                    地声最高音
                  </label>

                  <select
                    id="highestNote"
                    value={highestNote}
                    onChange={(event) =>
                      setHighestNote(event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">
                      指定なし
                    </option>

                    {noteOrder.map((note) => (
                      <option key={note} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-zinc-400">
                    この音以下の曲
                  </p>
                </div>

                {/* 裏声最高音 */}
                <div>
                  <label
                    htmlFor="falsettoHighestNote"
                    className="text-xs font-bold text-zinc-500"
                  >
                    裏声最高音
                  </label>

                  <select
                    id="falsettoHighestNote"
                    value={falsettoHighestNote}
                    onChange={(event) =>
                      setFalsettoHighestNote(
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">
                      指定なし
                    </option>

                    {noteOrder.map((note) => (
                      <option key={note} value={note}>
                        {note}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-zinc-400">
                    この音以下の曲
                  </p>
                </div>
              </div>
            </div>

            {/* 難易度 */}
            <div>
              <label
                htmlFor="difficulty"
                className="text-sm font-bold text-zinc-700"
              >
                総合難易度
              </label>

              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
                }
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 md:max-w-sm"
              >
                <option value="">
                  指定なし
                </option>

                <option value="1">
                  ★☆☆☆☆ 以下
                </option>

                <option value="2">
                  ★★☆☆☆ 以下
                </option>

                <option value="3">
                  ★★★☆☆ 以下
                </option>

                <option value="4">
                  ★★★★☆ 以下
                </option>

                <option value="5">
                  ★★★★★
                </option>
              </select>
            </div>

            {/* ジャンル */}
            <div>
              <h3 className="text-sm font-bold text-zinc-700">
                ジャンル
              </h3>

              <p className="mt-2 text-xs text-zinc-400">
                複数選択できます
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {genres.map((genre) => {
                  const isSelected =
                    selectedGenres.includes(genre);

                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* リリース年 */}
            <div>
              <h3 className="text-sm font-bold text-zinc-700">
                リリース年
              </h3>

              <p className="mt-2 text-xs text-zinc-400">
                年の範囲を指定できます
              </p>

              <div className="mt-3 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
                <select
                  value={releaseYearFrom}
                  onChange={(event) =>
                    setReleaseYearFrom(event.target.value)
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 md:w-48"
                >
                  <option value="">
                    指定なし
                  </option>

                  {releaseYears.map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>

                <span className="text-center text-sm font-bold text-zinc-400">
                  〜
                </span>

                <select
                  value={releaseYearTo}
                  onChange={(event) =>
                    setReleaseYearTo(event.target.value)
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 md:w-48"
                >
                  <option value="">
                    指定なし
                  </option>

                  {releaseYears.map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* リセット */}
            <div className="flex justify-end border-t border-zinc-100 pt-6">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-bold text-zinc-400 transition hover:text-blue-600"
              >
                条件をリセット
              </button>
            </div>
          </div>
        </section>

        {/* 検索結果 */}
        <section className="mt-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600">
                SEARCH RESULTS
              </p>

              <h2 className="mt-2 text-2xl font-black">
                検索結果
              </h2>
            </div>

            <p className="text-sm font-bold text-zinc-500">
              {filteredSongs.length}曲
            </p>
          </div>

          {filteredSongs.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-16 text-center">
              <div className="text-4xl">
                🎤
              </div>

              <h3 className="mt-5 text-xl font-black">
                曲が見つかりませんでした
              </h3>

              <p className="mt-3 text-sm text-zinc-500">
                検索条件を少し変えてみてください。
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                条件をリセット
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {filteredSongs.map((song) => (
                <Link
                  key={song.id}
                  href={`/search/${song.id}`}
                  className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black transition group-hover:text-blue-600">
                        {song.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-zinc-500">
                        {song.artist}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      {song.releaseYear}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500">
                      {song.genre}
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-blue-50/70 p-4 text-center">
                    <p className="text-xs font-bold text-blue-500">
                      総合難易度
                    </p>

                    <div className="mt-1">
                      <Rating value={song.difficulty} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">
                        地声最高音
                      </span>

                      <span className="text-sm font-black text-blue-600">
                        {song.highestNote}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">
                        地声最低音
                      </span>

                      <span className="text-sm font-black text-blue-600">
                        {song.lowestNote}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">
                        裏声最高音
                      </span>

                      <span className="text-sm font-black text-orange-500">
                        {song.falsettoHighestNote}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 text-right text-sm font-bold text-blue-600">
                    詳細を見る →
                  </div>
                </Link>
              ))}
            </div>
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