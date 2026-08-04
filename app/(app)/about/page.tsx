import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Volume2, Repeat, Sparkles, Layers, ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/config"

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "Español Real — тренажёр живого испанского, на котором говорят в Испании. Метод, программа и философия курса.",
}

const METHOD = [
  {
    icon: Layers,
    title: "От простого к сложному",
    text: "45 уроков выстроены по нарастанию: от первых фраз в квартире до собеседования и живой болтовни с друзьями.",
  },
  {
    icon: Repeat,
    title: "Интервальное повторение",
    text: "Выученные фразы возвращаются точно тогда, когда вы начинаете их забывать — по алгоритму SRS.",
  },
  {
    icon: Volume2,
    title: "Живое произношение",
    text: "Каждую фразу можно прослушать. Вы привыкаете к настоящему кастильскому звучанию, а не к учебному.",
  },
  {
    icon: Sparkles,
    title: "Игровая мотивация",
    text: "XP, уровни, серии дней и достижения превращают ежедневную практику в привычку, от которой сложно отказаться.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
          <MapPin className="h-4 w-4" />
          Испанский, как в Испании
        </span>
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground text-balance md:text-4xl">
          Не учебный испанский, а тот, на котором реально говорят
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
          {SITE.name} — тренажёр для тех, кто переезжает в Испанию или уже живёт там. Мы учим
          выживать и общаться в реальных ситуациях: в банке, у врача, на работе и с соседями.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Зачем этот тренажёр</h2>
          <p className="leading-relaxed text-muted-foreground">
            Классические курсы учат «правильному» испанскому из учебников. Но в очереди в банке или
            в разговоре с соседом вы слышите совсем другое — сокращения, разговорные обороты,
            быструю речь. {SITE.name} строится вокруг реальных диалогов и фраз, которые нужны с
            первого дня жизни в стране.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Каждый урок — это набор практических фраз с переводом, произношением и разбором. Вы не
            просто заучиваете слова, а сразу отрабатываете их в упражнениях разных типов.
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Как устроен метод</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {METHOD.map((m) => (
            <Card key={m.title}>
              <CardContent className="flex gap-3 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <m.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">{m.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground text-pretty">
                    {m.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="flex items-start gap-3 p-6">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-secondary" />
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Ваш прогресс — только ваш</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Тренажёр работает полностью в браузере. Прогресс, XP и серии сохраняются локально на
              вашем устройстве — регистрация не нужна, а данные никуда не отправляются.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3 rounded-3xl bg-primary p-8 text-center text-primary-foreground">
        <h2 className="font-heading text-2xl font-extrabold text-balance">
          Готовы говорить по-испански по-настоящему?
        </h2>
        <p className="max-w-md text-primary-foreground/80 text-pretty">
          Первые {SITE.trialLessons} уроков бесплатны. Полный курс из 45 уроков — {SITE.price}.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-2 font-bold">
          <Link href="/lessons">Начать учиться</Link>
        </Button>
      </div>
    </div>
  )
}
