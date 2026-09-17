import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
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

      {/* Main Content */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest text-blue-600">
            CONTACT
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            お問い合わせ
          </h1>

          <p className="mt-5 leading-8 text-zinc-500">
            UTA-MATCHに関するご意見・ご要望・不具合のご報告などは、
            以下のフォームからお問い合わせください。
          </p>
        </div>

        {/* Contact Form */}
        <form
          action="https://formspree.io/f/xkjgnrkn"
          method="POST"
          className="rounded-3xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm md:p-8"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-zinc-700"
            >
              お名前
              <span className="ml-2 text-xs font-normal text-zinc-400">
                任意
              </span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="例：山田 太郎"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-zinc-700"
            >
              メールアドレス
              <span className="ml-2 text-xs font-bold text-blue-600">
                必須
              </span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="example@email.com"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Message */}
          <div className="mt-6">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-bold text-zinc-700"
            >
              お問い合わせ内容
              <span className="ml-2 text-xs font-bold text-blue-600">
                必須
              </span>
            </label>

            <textarea
              id="message"
              name="message"
              required
              rows={8}
              placeholder="お問い合わせ内容をご入力ください。"
              className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Privacy */}
          <p className="mt-5 text-xs leading-6 text-zinc-500">
            送信いただいた情報は、お問い合わせへの対応のために使用します。
            詳しくは
            <Link
              href="/privacy"
              className="mx-1 font-bold text-blue-600 hover:underline"
            >
              プライバシーポリシー
            </Link>
            をご確認ください。
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="mt-7 w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            お問い合わせを送信
          </button>
        </form>

        {/* Back */}
        <div className="mt-10">
          <Link
            href="/"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            ← トップページに戻る
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm font-black text-blue-600">
            UTA-MATCH
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="text-xs text-zinc-500 transition hover:text-blue-600"
            >
              プライバシーポリシー
            </Link>

            <Link
              href="/contact"
              className="text-xs text-zinc-500 transition hover:text-blue-600"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}