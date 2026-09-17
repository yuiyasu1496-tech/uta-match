import Link from "next/link";

export default function Home() {
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
            href="/search"
            className="text-sm font-bold text-blue-600"
          >
            曲を探す
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.2em] text-blue-600">
              FOR MEN'S KARAOKE
            </p>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              自分の声に、
              <br />
              歌える曲をマッチ。
            </h1>

            <p className="mt-6 text-base leading-8 text-zinc-500 md:text-lg">
              男性向けカラオケ曲検索サービス。
              <br />
              自分の声域や歌いやすさから、
              <br className="md:hidden" />
              自分に合った曲を探せます。
            </p>

            <Link
              href="/search"
              className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              曲を探してみる
              <span className="ml-2 text-lg">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-widest text-blue-600">
              ABOUT UTA-MATCH
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              「歌いたい曲」と
              <br />
              「歌える曲」は、違う。
            </h2>

            <p className="mt-6 leading-8 text-zinc-500">
              人気の曲だから歌ってみたけど、高すぎて歌えない。
              <br />
              逆に、知らない曲だけど意外と自分の声に合っている。
            </p>

            <p className="mt-4 leading-8 text-zinc-500">
              UTA-MATCHは、男性の声域を基準に、
              曲の音域や歌いやすさを整理。
              <br />
              「自分が歌える曲」を見つけるためのカラオケ検索サービスです。
            </p>
          </div>
        </div>
      </section>

      {/* How to search */}
      <section className="bg-blue-50/50">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600">
              HOW TO SEARCH
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              自分に合う曲を探す
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">
              <div className="text-3xl">
                🎵
              </div>

              <h3 className="mt-5 text-xl font-black">
                音域から探す
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                地声の最高音・最低音、裏声の最高音から、
                自分の声域に合う曲を探せます。
              </p>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">
              <div className="text-3xl">
                ⭐
              </div>

              <h3 className="mt-5 text-xl font-black">
                難易度から探す
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                スタミナ・肺活量・早口など、
                曲ごとの歌いやすさを確認できます。
              </p>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">
              <div className="text-3xl">
                🔍
              </div>

              <h3 className="mt-5 text-xl font-black">
                曲名から探す
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                気になる曲を検索して、
                音域や難易度、歌唱ポイントをチェックできます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Database */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-8 md:p-12">
            <p className="text-sm font-bold tracking-widest text-blue-600">
              SONG DATABASE
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              自分の声に合う曲を、
              <br />
              もっと見つけよう。
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-zinc-500">
              UTA-MATCHでは、男性が歌うことを基準に、
              曲ごとの音域や歌いやすさを分析しています。
              <br />
              これからさらに多くの曲を追加していきます。
            </p>

            <Link
              href="/search"
              className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              曲を探す
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm font-black text-blue-600">
            UTA-MATCH
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            男性向けカラオケ曲検索サービス
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            自分の声に、歌える曲をマッチ。
          </p>
        </div>
      </footer>
    </main>
  );
}