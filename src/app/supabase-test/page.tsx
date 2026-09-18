import { supabase } from "@/lib/supabase";

export default async function SupabaseTestPage() {
  const { data: songs, error } = await supabase
    .from("songs")
    .select("id, slug, title, artist")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-white p-10 text-zinc-900">
        <h1 className="text-2xl font-bold text-red-600">
          Supabase接続エラー
        </h1>

        <pre className="mt-6 whitespace-pre-wrap rounded-xl bg-red-50 p-5">
          {error.message}
        </pre>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-10 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          Supabase接続テスト
        </h1>

        <p className="mt-3 text-zinc-600">
          取得曲数：{songs?.length ?? 0}曲
        </p>

        <div className="mt-8 space-y-3">
          {songs?.map((song) => (
            <div
              key={song.id}
              className="rounded-xl border border-zinc-200 p-4"
            >
              <p className="font-bold">{song.title}</p>
              <p className="text-sm text-zinc-500">
                {song.artist}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {song.slug}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}