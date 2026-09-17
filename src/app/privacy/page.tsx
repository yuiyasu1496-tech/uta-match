import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-blue-600"
          >
            UTA-MATCH
          </Link>

          <Link
            href="/search"
            className="text-sm font-bold text-zinc-700 transition hover:text-blue-600"
          >
            曲を探す
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <p className="mb-3 text-sm font-bold tracking-widest text-blue-600">
            PRIVACY POLICY
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            プライバシーポリシー
          </h1>

          <p className="mt-5 leading-8 text-zinc-600">
            Uta-Match（以下「当サイト」）では、当サイトをご利用いただく方の
            情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
          </p>
        </div>

        <div className="space-y-12">
          {/* 1 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              1. 個人情報の取得について
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトでは、お問い合わせ等の際に、氏名、メールアドレスなどの
              個人情報をご提供いただく場合があります。
              取得した個人情報は、お問い合わせへの回答や必要なご連絡のために利用し、
              これらの目的以外では利用しません。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              2. 広告配信について
            </h2>

            <div className="space-y-4 leading-8 text-zinc-600">
              <p>
                当サイトでは、第三者配信の広告サービス
                「Google AdSense（グーグルアドセンス）」を利用する場合があります。
              </p>

              <p>
                Googleなどの第三者配信事業者は、Cookieを使用して、
                ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の
                情報に基づいて広告を配信することがあります。
              </p>

              <p>
                Googleが広告Cookieを使用することにより、
                Googleおよびそのパートナーは、ユーザーの当サイトや
                他のウェブサイトへのアクセス情報に基づいて、
                適切な広告を表示できるようになります。
              </p>

              <p>
                ユーザーは、Googleの広告設定から
                パーソナライズド広告を無効にすることができます。
              </p>

              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-bold text-blue-600 hover:underline"
              >
                Google 広告設定
              </a>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              3. Cookieについて
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトでは、広告配信、利用状況の分析、サービス改善などのために
              Cookieを使用する場合があります。
              Cookieはユーザーのブラウザに保存される情報であり、
              ブラウザの設定によってCookieの使用を制限または無効にすることができます。
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              4. アクセス解析について
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトでは、サイトの利用状況を把握し、サービスを改善するため、
              アクセス解析サービスを利用する場合があります。
              これらのサービスでは、Cookie等を利用してアクセス情報が
              収集される場合があります。
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              5. 個人情報の第三者提供について
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトでは、法令に基づく場合などを除き、
              本人の同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              6. 免責事項
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトでは、掲載する情報について可能な限り正確な情報を提供するよう
              努めていますが、その正確性、完全性、安全性等を保証するものではありません。
              当サイトに掲載された情報を利用したことによって生じた損害等について、
              当サイトは法令上認められる範囲で責任を負いかねます。
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              7. 著作権について
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトに掲載している文章、独自の評価、分析その他のコンテンツについて、
              当サイトまたは正当な権利者に権利が帰属するものは、
              法令で認められる場合を除き、無断で転載・複製することを禁止します。
              また、楽曲名、アーティスト名その他第三者に権利が帰属するものについては、
              各権利者にその権利が帰属します。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-xl font-black">
              8. プライバシーポリシーの変更
            </h2>

            <p className="leading-8 text-zinc-600">
              当サイトは、法令の変更やサービス内容の変更等に応じて、
              本プライバシーポリシーを変更する場合があります。
              変更後のプライバシーポリシーは、当サイト上に掲載した時点から
              効力を生じるものとします。
            </p>
          </section>

          {/* Date */}
          <div className="border-t border-zinc-200 pt-8 text-sm text-zinc-500">
            制定日：2026年9月17日
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <Link
            href="/"
            className="font-black tracking-tight text-blue-600"
          >
            UTA-MATCH
          </Link>

          <p className="mt-2 text-sm text-zinc-500">
            自分の声に、歌える曲をマッチ。
          </p>
        </div>
      </footer>
    </main>
  );
}