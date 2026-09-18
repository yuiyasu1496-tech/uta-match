"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { songs } from "@/data/songs";

const MAX_SELECTION = 5;

export default function DiagnosisPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const filteredSongs = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    if (!searchText) {
      return songs;
    }

    return songs.filter((song) => {
      return (
        song.title.toLowerCase().includes(searchText) ||
        song.artist.toLowerCase().includes(searchText)
      );
    });
  }, [keyword]);

  function toggleSong(songId: string) {
    setSelectedSongIds((current) => {
      if (current.includes(songId)) {
        return current.filter((id) => id !== songId);
      }

      if (current.length >= MAX_SELECTION) {
        return current;
      }

      return [...current, songId];
    });
  }

  const selectedSongs = selectedSongIds
    .map((id) => songs.find((song) => song.id === id))
    .filter((song) => song !== undefined);

  const canContinue = selectedSongIds.length === MAX_SELECTION;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* ヘッダー */}
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

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-5xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-sm font-bold tracking-[0.2em] text-blue-600">
            SINGING TYPE DIAGNOSIS
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
              STEP 1
            </span>

            <span className="text-sm font-bold text-zinc-400">
              曲を選ぶ
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
            普段カラオケで歌う曲を
            <br className="hidden md:block" />
            5曲選んでください
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-500">
            実際に歌ったことのある曲を選ぶことで、
            あなたの歌いやすい音域や苦手なポイントを分析します。
          </p>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4">
            <p className="text-sm font-bold leading-6 text-blue-700">
              💡 歌いやすい曲だけでなく、
              「普通」「ちょっと歌いにくい」と感じる曲も混ぜると
              診断精度が上がります。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-32">
        {/* 選択数 */}
        <section className="sticky top-0 z-20 border-b border-blue-100 bg-white/95 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-zinc-500">
                選択中
              </p>

              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-600">
                  {selectedSongIds.length}
                </span>

                <span className="text-sm font-bold text-zinc-400">
                  / {MAX_SELECTION}曲
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: MAX_SELECTION }).map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-10 rounded-full transition ${
                    index < selectedSongIds.length
                      ? "bg-blue-600"
                      : "bg-zinc-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 検索 */}
        <section className="mt-8">
          <label
            htmlFor="diagnosis-song-search"
            className="text-sm font-bold text-zinc-700"
          >
            曲名・アーティストから検索
          </label>

          <input
            id="diagnosis-song-search"
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="例：Lemon、米津玄師"
            className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-base outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
        </section>

        {/* 曲一覧 */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600">
                SONGS
              </p>

              <h2 className="mt-2 text-2xl font-black">
                曲を選択
              </h2>
            </div>

            <p className="text-sm font-bold text-zinc-400">
              {filteredSongs.length}曲
            </p>
          </div>

          {filteredSongs.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-14 text-center">
              <div className="text-4xl">
                🎤
              </div>

              <h3 className="mt-5 text-lg font-black">
                曲が見つかりませんでした
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                別の曲名やアーティスト名で検索してみてください。
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filteredSongs.map((song) => {
                const isSelected = selectedSongIds.includes(song.id);
                const isDisabled =
                  selectedSongIds.length >= MAX_SELECTION &&
                  !isSelected;

                return (
                  <button
                    key={song.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => toggleSong(song.id)}
                    className={`group flex w-full items-center justify-between gap-5 rounded-3xl border p-5 text-left transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : isDisabled
                          ? "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-45"
                          : "border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="min-w-0">
                      <h3
                        className={`truncate text-lg font-black ${
                          isSelected
                            ? "text-blue-700"
                            : "text-zinc-900"
                        }`}
                      >
                        {song.title}
                      </h3>

                      <p className="mt-1 truncate text-sm font-medium text-zinc-500">
                        {song.artist}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-500">
                          {song.releaseYear}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-500">
                          {song.genre}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-lg font-black transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-zinc-200 bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 選択した曲 */}
        {selectedSongs.length > 0 && (
          <section className="mt-10 rounded-3xl bg-zinc-50 p-6">
            <p className="text-sm font-bold text-zinc-500">
              選択した曲
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedSongs.map((song, index) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => toggleSong(song.id)}
                  className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-600 transition hover:border-blue-300"
                >
                  {index + 1}. {song.title}
                  <span className="ml-2 text-zinc-300">
                    ×
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 次へ */}
        <section className="mt-10 text-center">
          {canContinue ? (
            <Link
              href={`/diagnosis/rating?songs=${selectedSongIds.join(",")}`}
              className="inline-flex items-center rounded-full bg-blue-600 px-8 py-4 text-base font-black text-white shadow-sm transition hover:bg-blue-700"
            >
              この5曲で診断する
              <span className="ml-2">
                →
              </span>
            </Link>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full bg-zinc-200 px-8 py-4 text-base font-black text-zinc-400"
              >
                あと{MAX_SELECTION - selectedSongIds.length}曲選んでください
              </button>

              <p className="mt-3 text-xs font-medium text-zinc-400">
                5曲選ぶと次へ進めます
              </p>
            </>
          )}
        </section>
      </div>

      {/* フッター */}
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