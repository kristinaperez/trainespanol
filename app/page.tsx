import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  MapPin,
  MessageSquareQuote,
  Repeat,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react"
import { DemoFlashcard } from "@/components/landing/demo-flashcard"
import { getLessonCount } from "@/lib/lessons"
import { SITE, ADAPTATION_MAP } from "@/lib/config"

export default function LandingPage() {
  const lessonCount = getLessonCount()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Español Real",
    description:
      "Interactive trainer for real-life Spanish spoken in Spain: phrases, flashcards and spaced repetition.",
    provider: { "@type": "Organization", name: "Español Real" },
    offers: { "@type": "Offer", price: "15", priceCurrency: "EUR" },
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-black text-foreground">
            <span className="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">ñ</span>
            <span className="text-lg">{SITE.name}</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-muted-foreground md:flex">
            <a href="#how" className="transition hover:text-foreground">Как это работает</a>
            <a href="#map" className="transition hover:text-foreground">Карта адаптации</a>
            <a href="#price" className="transition hover:text-foreground">Цена</a>
          </nav>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:brightness-105"
          >
            Начать <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-sm font-bold text-gold-foreground">
              <MapPin className="size-4" /> Испанский, на котором реально говорят в Испании
            </span>
            <h1 className="mt-5 text-balance text-4xl font-black leading-[1.05] text-foreground md:text-6xl">
              Перестань зубрить грамматику. Начни <span className="text-primary">понимать испанцев</span>.
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {lessonCount} интерактивных уроков из живых фраз, которые слышишь в баре, банке, у врача и от соцработника.
              Флешкарты, интервальное повторение и карта адаптации к жизни в Испании.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-black text-primary-foreground transition hover:brightness-105"
              >
                Учиться бесплатно <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/lessons/1"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-card px-7 py-3.5 text-base font-black text-foreground transition hover:border-primary"
              >
                Попробовать урок
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-success" /> Первые {SITE.trialLessons} уроков бесплатно · без регистрации
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <DemoFlashcard />
          </div>
        </div>
      </section>

      {/* Problem / solution */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-border p-7">
            <h2 className="text-xl font-black text-foreground">В учебниках так не говорят</h2>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              {[
                "Учишь спряжения, а в баре не понимаешь ни слова",
                "Слышишь «vale», «ya está», «me pones» — и теряешься",
                "Реальная речь быстрее и короче, чем в аудио для учебника",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-primary bg-primary/5 p-7">
            <h2 className="text-xl font-black text-foreground">Мы учим по-другому</h2>
            <ul className="mt-4 space-y-3 text-foreground">
              {[
                "Только живые фразы с комментариями автора «где и когда так говорят»",
                "Флешкарты + повторение, пока фраза не осядет в голове",
                "Прогресс = реальные бытовые ситуации в Испании",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works / features */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-balance text-center text-3xl font-black text-foreground md:text-4xl">
          Как устроен тренажёр
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-center text-muted-foreground">
          Каждый урок — это набор фраз, которые ты сначала учишь карточками, а потом закрепляешь в разных упражнениях.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BookOpen, title: "Флешкарты", text: "Учи фразы с примерами, произношением и заметками автора." },
            { icon: Zap, title: "7 типов упражнений", text: "Выбор перевода, собери фразу, вставь слово, верно/неверно и другие." },
            { icon: Repeat, title: "Интервальное повторение", text: "Ошибки и новые фразы возвращаются в нужный день, чтобы не забыть." },
            { icon: Flame, title: "Стрик и цели", text: "Ежедневная серия, XP, уровни и дневная цель держат в тонусе." },
            { icon: Trophy, title: "Достижения", text: "Открывай награды за прогресс и идеальные уроки." },
            { icon: MapPin, title: "Карта адаптации", text: "Прогресс превращается в этапы жизни в Испании." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl border-2 border-border bg-card p-6">
              <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-black text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Adaptation map preview */}
      <section id="map" className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <MapPin className="size-4" /> Фишка тренажёра
          </div>
          <h2 className="mt-2 text-balance text-3xl font-black text-foreground md:text-4xl">
            Карта адаптации к жизни в Испании
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            Твой прогресс — это не абстрактные проценты. Каждый блок уроков открывает новый этап реальной жизни: от
            заселения в квартиру до «чувствую себя как дома».
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {ADAPTATION_MAP.map((s) => (
              <div key={s.id} className="rounded-2xl border-2 border-border bg-card p-4 text-center">
                <div className="text-3xl" aria-hidden>{s.emoji}</div>
                <p className="mt-2 text-sm font-black text-foreground">{s.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Уроки {s.lessons[0]}–{s.lessons[s.lessons.length - 1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-black text-foreground md:text-4xl">Что говорят ученики</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { name: "Марина", city: "Валенсия", text: "Наконец-то понимаю, что мне говорят в баре и в банке. Учебники так не готовят." },
            { name: "Алексей", city: "Мадрид", text: "Карта адаптации — гениально. Видишь, что реально приближаешься к нормальной жизни." },
            { name: "Даша", city: "Барселона", text: "Флешкарты и повторение зашли. Фразы сами всплывают в голове в нужный момент." },
          ].map((t) => (
            <figure key={t.name} className="rounded-3xl border-2 border-border bg-card p-6">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-pretty leading-relaxed text-foreground">
                <MessageSquareQuote className="mb-1 size-5 text-primary/40" />
                {t.text}
              </blockquote>
              <figcaption className="mt-4 text-sm font-bold text-muted-foreground">
                {t.name}, {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="price" className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-sm font-bold text-gold-foreground">
            <Sparkles className="size-4" /> Один раз — и навсегда
          </span>
          <h2 className="mt-4 text-balance text-3xl font-black text-foreground md:text-4xl">
            Весь тренажёр за {SITE.price}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Первые {SITE.trialLessons} уроков бесплатно. Дальше — единоразовый доступ ко всем {lessonCount} урокам,
            повторению и обновлениям.
          </p>
          <div className="mx-auto mt-8 max-w-sm rounded-3xl border-2 border-primary bg-background p-7 text-left shadow-lg">
            <div className="flex items-end gap-1">
              <span className="text-5xl font-black text-foreground">{SITE.price}</span>
              <span className="mb-1.5 text-sm font-bold text-muted-foreground">/ навсегда</span>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                `Все ${lessonCount} уроков`,
                "Флешкарты и 7 типов упражнений",
                "Интервальное повторение",
                "Карта адаптации, стрик и достижения",
                "Работает офлайн, весь прогресс с тобой",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-foreground">
                  <CheckCircle2 className="size-5 shrink-0 text-success" /> {t}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-black text-primary-foreground transition hover:brightness-105"
            >
              Начать бесплатно <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Brain className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 text-balance text-3xl font-black text-foreground md:text-5xl">
          Твой испанский начинается сегодня
        </h2>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-black text-primary-foreground transition hover:brightness-105"
        >
          Открыть тренажёр <ArrowRight className="size-5" />
        </Link>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <span className="font-bold text-foreground">{SITE.name}</span>
          <nav className="flex gap-5">
            <Link href="/about" className="transition hover:text-foreground">О проекте</Link>
            <Link href="/lessons" className="transition hover:text-foreground">Уроки</Link>
            <Link href="/dashboard" className="transition hover:text-foreground">Кабинет</Link>
          </nav>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  )
}
