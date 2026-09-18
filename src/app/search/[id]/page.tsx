import Link from "next/link";
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

function getNotePercentage(note: string) {
  const position = noteOrder.indexOf(note);

  if (position === -1) {
    return null;
  }

  const maxPosition = noteOrder.length - 1;

  return (position / maxPosition) * 100;
}

function Rating({
  value,
  size = "text-xl",
}: {
  value: number;
  size?: string;
}) {
  return (
    <span
      className={`${size} tracking-wide text-blue-600`}
      aria-label={`難易度 ${value} / 5`}
    >
      {"★".repeat(value)}

      <span className="text-blue-100">
        {"★".repeat(5 - value)}
      </span>
    </span>
  );
}

function RangeItem({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "ground" | "falsetto";
}) {
  return (
    <div className="rounded-2xl bg-zinc-50 px-4 py-4 text-center">
      <p className="text-xs font-bold text-zinc-500">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-black ${
          type === "ground"
            ? "text-blue-600"
            : "text-orange-500"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function VocalRangeBar({
  lowestNote,
  highestNote,
  falsettoLowestNote,
  falsettoHighestNote,
}: {
  lowestNote: string;
  highestNote: string;
  falsettoLowestNote: string | null;
  falsettoHighestNote: string | null;
}) {
  const lowestLeft = getNotePercentage(lowestNote);
  const highestLeft = getNotePercentage(highestNote);

  if (
    lowestLeft === null ||
    highestLeft === null
  ) {
    return (
      <div className="mt-8 rounded-2xl bg-zinc-50 px-5 py-6 text-sm text-zinc-500">
        音域データを正しく表示できませんでした。
      </div>
    );
  }

  const groundRangeWidth = Math.max(
    highestLeft - lowestLeft,
    0,
  );

  const hasFalsetto =
    falsettoLowestNote !== null &&
    falsettoHighestNote !== null;

  const falsettoLowestLeft = hasFalsetto
    ? getNotePercentage(falsettoLowestNote)
    : null;

  const falsettoHighestLeft = hasFalsetto
    ? getNotePercentage(falsettoHighestNote)
    : null;

  const canDisplayFalsettoRange =
    hasFalsetto &&
    falsettoLowestLeft !== null &&
    falsettoHighestLeft !== null;

  const falsettoRangeWidth =
    canDisplayFalsettoRange
      ? Math.max(
          falsettoHighestLeft - falsettoLowestLeft,
          0,
        )
      : 0;

  return (
    <div className="mt-8">
      {/* 地声 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-black text-blue-600">
            地声
          </span>

          <span className="text-sm font-bold text-zinc-600">
            {lowestNote} 〜 {highestNote}
          </span>
        </div>

        <div className="relative h-7">
          <div className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 rounded-full bg-zinc-100" />

          <div
            className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-blue-500"
            style={{
              left: `${lowestLeft}%`,
              width: `${groundRangeWidth}%`,
            }}
          />

          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-blue-600 shadow-sm"
            style={{
              left: `${lowestLeft}%`,
            }}
          />

          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-blue-600 shadow-sm"
            style={{
              left: `${highestLeft}%`,
            }}
          />
        </div>
      </div>

      {/* 裏声 */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-black text-orange-500">
            裏声
          </span>

          <span className="text-sm font-bold text-zinc-600">
            {canDisplayFalsettoRange
              ? `${falsettoLowestNote} 〜 ${falsettoHighestNote}`
              : "使用なし"}
          </span>
        </div>

        {canDisplayFalsettoRange ? (
          <div className="relative h-7">
            <div className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 rounded-full bg-zinc-100" />

            <div
              className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-orange-400"
              style={{
                left: `${falsettoLowestLeft}%`,
                width: `${falsettoRangeWidth}%`,
              }}
            />

            <div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-orange-500 shadow-sm"
              style={{
                left: `${falsettoLowestLeft}%`,
              }}
            />

            <div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-orange-500 shadow-sm"
              style={{
                left: `${falsettoHighestLeft}%`,
              }}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-orange-50 px-5 py-4 text-sm font-bold text-orange-500">
            この曲では裏声を使用しません
          </div>
        )}
      </div>

      {/* 音域データ */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <RangeItem
          label="地声最低音"
          value={lowestNote}
          type="ground"
        />

        <RangeItem
          label="地声最高音"
          value={highestNote}
          type="ground"
        />

        <RangeItem
          label="裏声最低音"
          value={falsettoLowestNote ?? "使用なし"}
          type="falsetto"
        />

        <RangeItem
          label="裏声最高音"
          value={falsettoHighestNote ?? "使用なし"}
          type="falsetto"
        />
      </div>
    </div>
  );
}

function DifficultyItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-5 py-4">
      <span className="whitespace-nowrap font-bold text-zinc-700">
        {label}
      </span>

      <Rating
        value={value}
        size="text-base"
      />
    </div>
  );
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const song = songs.find((song) => song.id === id);

  if (!song) {
    return (
      <main className="min-h-screen bg-white text-zinc-900">
        <header className="border-b border-blue-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-5">
            <Link
              href="/"
              className="text-xl font-black tracking-tight text-blue-600"
            >
              UTA-MATCH
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-16 text-center">
            <div className="text-4xl">
              🎤
            </div>

            <h1 className="mt-5 text-2xl font-black">
              曲が見つかりませんでした
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              指定された曲は登録されていません。
            </p>

            <Link
              href="/search"
              className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              曲を探す
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            href="/search"
            className="text-sm font-bold text-blue-600"
          >
            曲を探す
          </Link>
        </div>
      </header>

      {/* 曲タイトル */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-14 md:pb-18 md:pt-18">
          <Link
            href="/search"
            className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            ← 曲を探す
          </Link>

          <div className="mt-8">
            <p className="text-sm font-bold tracking-[0.2em] text-blue-600">
              SONG DETAIL
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              {song.title}
            </h1>

            <p className="mt-3 text-lg font-medium text-zinc-500">
              {song.artist}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-600 shadow-sm">
                {song.releaseYear}
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-600 shadow-sm">
                {song.genre}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20 md:pb-24">
        {/* 歌唱難易度 */}
        <section className="-mt-2 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600">
                DIFFICULTY
              </p>

              <h2 className="mt-2 text-2xl font-black">
                歌唱難易度
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Uta-Match独自評価
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-6 py-4 text-center">
              <p className="text-xs font-bold text-blue-500">
                総合難易度
              </p>

              <div className="mt-1">
                <Rating
                  value={song.difficulty}
                  size="text-2xl"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <DifficultyItem
              label="地声高音頻度"
              value={song.highNoteFrequency}
            />

            <DifficultyItem
              label="高音ロングトーン"
              value={song.highNoteLongTone}
            />

            <DifficultyItem
              label="ブレス"
              value={song.breath}
            />

            <DifficultyItem
              label="滑舌"
              value={song.fastLyrics}
            />

            <DifficultyItem
              label="音程変化"
              value={song.pitchMovement}
            />

            <DifficultyItem
              label="リズム"
              value={song.rhythm}
            />
          </div>
        </section>

        {/* 音域 */}
        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600">
              VOCAL RANGE
            </p>

            <h2 className="mt-2 text-2xl font-black">
              音域
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              この曲で使用される地声・裏声の音域
            </p>
          </div>

          <VocalRangeBar
            lowestNote={song.lowestNote}
            highestNote={song.highestNote}
            falsettoLowestNote={song.falsettoLowestNote}
            falsettoHighestNote={song.falsettoHighestNote}
          />
        </section>

        {/* Uta-Match分析 */}
        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold tracking-widest text-blue-600">
            UTA-MATCH ANALYSIS
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Uta-Match分析
          </h2>

          {song.analysis ? (
            <div className="mt-6 rounded-2xl bg-blue-50/70 p-6">
              <p className="leading-8 text-zinc-700">
                {song.analysis}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-zinc-50 p-6">
              <p className="text-sm font-medium text-zinc-400">
                分析データは準備中です。
              </p>
            </div>
          )}
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/search"
            className="inline-flex items-center rounded-full bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            曲を探す

            <span className="ml-2">
              →
            </span>
          </Link>
        </div>
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