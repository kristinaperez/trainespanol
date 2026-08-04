// Data generator: writes one JSON file per lesson into /data/lessons.
// Source: the author's proprietary textbook "Español Real".
// Run with: node scripts/gen-lessons.mjs
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"

const OUT = join(process.cwd(), "data", "lessons")
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

/**
 * Each lesson:
 * { lesson, title, category, difficulty, tags, intro, authorComment, phrases[] }
 * phrase: { spanish, translation, example, exampleTranslation, notes, difficulty, tags }
 */
const lessons = [
  {
    lesson: 1,
    title: "Me cuentas",
    category: "Social Worker",
    difficulty: "A1",
    tags: ["pronouns", "daily life", "annoying combos"],
    intro: "Самые надоевшие сочетания, часть 1. Сочетания с предлогом-местоимением в начале фразы. В русском мы ставим «мне» после глагола («расскажешь мне»), а испанцы говорят «мне расскажешь».",
    authorComment: "Чтобы их понимать и использовать, надо поменять свою привычку говорить: местоимение уходит в начало.",
    phrases: [
      { spanish: "Me cuentas", translation: "Расскажешь мне", example: "Lo haces y me cuentas.", exampleTranslation: "Сходишь и потом мне расскажешь.", notes: "Соцработник говорит вам сходить куда-то и закончит фразу так.", difficulty: "A1", tags: ["pronouns", "daily life"] },
      { spanish: "Me llamas", translation: "Позвони мне", example: "Me llamas.", exampleTranslation: "Позвони мне.", notes: "Подруга может написать так в WhatsApp.", difficulty: "A1", tags: ["pronouns", "phone"] },
      { spanish: "Ya", translation: "Всё / готово", example: "¡Ya!", exampleTranslation: "Всё, готово!", notes: "Говорится, когда сделано какое-то действие: вышла из ванной и говорю «Ya» — она свободна.", difficulty: "A1", tags: ["interjection", "daily life"] }
    ]
  },
  {
    lesson: 2,
    title: "Типичные фразы",
    category: "Daily Life",
    difficulty: "A1",
    tags: ["fillers", "verbs", "daily life"],
    intro: "Типичные разговорные фразы, которые слышишь постоянно.",
    authorComment: "«Vale» и «luego» — слова-чемпионы по частоте.",
    phrases: [
      { spanish: "Vale", translation: "Хорошо / Ок", example: "Quiero comprar zumo, vale.", exampleTranslation: "Я хочу купить сок, окей.", notes: "Может быть итогом разговора, а могут добавлять в конец каждой фразы.", difficulty: "A1", tags: ["fillers"] },
      { spanish: "Luego", translation: "Потом / позже", example: "Luego llamo y te escribo.", exampleTranslation: "Потом позвоню и напишу тебе.", notes: "Очень характерно, может употребляться отдельно: «Когда доделаешь? — Luego».", difficulty: "A1", tags: ["time", "fillers"] },
      { spanish: "Marchar", translation: "Идти, выходить", example: "Vosotros vais a marchar.", exampleTranslation: "Вы уже выходите.", notes: "Se marcha — уходят, также маршируют на фиесту.", difficulty: "A2", tags: ["verbs", "movement"] },
      { spanish: "Probar", translation: "Пробовать", example: "Quiero probar un examen.", exampleTranslation: "Хочу попробовать (сдать) экзамен.", notes: "", difficulty: "A2", tags: ["verbs"] },
      { spanish: "Inténtalo", translation: "Попробуй (ещё раз)", example: "Inténtalo.", exampleTranslation: "Попробуй ещё раз.", notes: "Настаивать, пробовать повторно.", difficulty: "A2", tags: ["verbs"] }
    ]
  },
  {
    lesson: 3,
    title: "То, что не использую, но существует",
    category: "School",
    difficulty: "A1",
    tags: ["pronouns", "daily life"],
    intro: "Фразы, которые пригодятся, даже если сам их пока не используешь.",
    authorComment: "Снова местоимение уходит в начало фразы.",
    phrases: [
      { spanish: "Me prestas", translation: "Одолжи мне", example: "¿Me prestas un boli?", exampleTranslation: "Одолжишь мне ручку?", notes: "На занятии нет ручки — спросить у соседа.", difficulty: "A1", tags: ["school", "pronouns"] },
      { spanish: "Me pillas", translation: "Ты меня застал(а)", example: "Ahora me pillas ocupado.", exampleTranslation: "Сейчас ты меня застал занятым.", notes: "Зовёте гулять, а знакомый занят.", difficulty: "A2", tags: ["pronouns", "daily life"] },
      { spanish: "Me coges", translation: "Забери меня", example: "¿Me coges?", exampleTranslation: "Заберёшь меня к себе?", notes: "", difficulty: "A2", tags: ["pronouns"] }
    ]
  },
  {
    lesson: 4,
    title: "Parece — кажется",
    category: "Social Worker",
    difficulty: "A1",
    tags: ["opinion", "verbs"],
    intro: "Parece используется сразу во фразе, чтобы оценить услышанное или дать одобрение.",
    authorComment: "Отличный способ выразить своё мнение и одобрение.",
    phrases: [
      { spanish: "Me parece bien", translation: "Мне кажется, хорошо", example: "Me parece bien.", exampleTranslation: "По-моему, это хорошо.", notes: "Оценить то, что вам рассказали, или дать одобрение.", difficulty: "A1", tags: ["opinion"] },
      { spanish: "¿Te parece bien?", translation: "Ты одобряешь?", example: "¿Te parece bien?", exampleTranslation: "Ты не против / одобряешь?", notes: "", difficulty: "A1", tags: ["opinion", "questions"] },
      { spanish: "¿Qué te parece?", translation: "Как тебе?", example: "¿Qué te parece?", exampleTranslation: "Как тебе такое?", notes: "", difficulty: "A1", tags: ["opinion", "questions"] },
      { spanish: "Te pareces a tu hermano", translation: "Ты похож(а) на брата", example: "Te pareces a tu hermano.", exampleTranslation: "Ты похож на своего брата.", notes: "Parecido — похожий: dos idiomas parecidos.", difficulty: "A2", tags: ["describing"] }
    ]
  },
  {
    lesson: 5,
    title: "Выражения с se (безличные)",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["grammar", "impersonal", "se"],
    intro: "Безличные конструкции и возвратные глаголы с se.",
    authorComment: "Se — маленькое слово с большим значением.",
    phrases: [
      { spanish: "Ella se va", translation: "Она ушла (покинула дом)", example: "Ella se va.", exampleTranslation: "Она уходит / ушла.", notes: "", difficulty: "A2", tags: ["se", "movement"] },
      { spanish: "Se marcha", translation: "Они уходят / маршируют", example: "Se marcha.", exampleTranslation: "Уходят или идут (маршируют) на празднике.", notes: "", difficulty: "A2", tags: ["se", "movement"] },
      { spanish: "El idioma se aprende", translation: "Язык учится", example: "El idioma se aprende.", exampleTranslation: "Язык учится (сам).", notes: "Безличная конструкция.", difficulty: "A2", tags: ["se", "impersonal"] }
    ]
  },
  {
    lesson: 6,
    title: "Dejalo / Apagalo",
    category: "Daily Life",
    difficulty: "A1",
    tags: ["commands", "verbs"],
    intro: "Повелительные фразы, которые слышишь дома и на собраниях.",
    authorComment: "Короткие команды с местоимением на конце.",
    phrases: [
      { spanish: "Déjalo", translation: "Оставь это", example: "Deja tu móvil.", exampleTranslation: "Отложи телефон.", notes: "На собрании попросили отложить телефон.", difficulty: "A1", tags: ["commands"] },
      { spanish: "Apágalo", translation: "Выключи его", example: "Apágalo.", exampleTranslation: "Выключи его!", notes: "Мама говорит ребёнку про телевизор.", difficulty: "A1", tags: ["commands"] }
    ]
  },
  {
    lesson: 7,
    title: "Sientate + прошедшее",
    category: "Police",
    difficulty: "A2",
    tags: ["commands", "past tense", "police"],
    intro: "Громкая фраза от полиции и первые формы прошедшего времени.",
    authorComment: "«Siéntate» я чётко услышала в полицейском участке в аэропорту.",
    phrases: [
      { spanish: "Siéntate", translation: "Сядь", example: "¡Siéntate!", exampleTranslation: "Сядьте!", notes: "Громкая и чёткая фраза от полиции.", difficulty: "A1", tags: ["commands", "police"] },
      { spanish: "Yo no sabía", translation: "Я не знала", example: "Yo no sabía.", exampleTranslation: "Я не знала.", notes: "Прошедшее время (imperfecto).", difficulty: "A2", tags: ["past tense"] },
      { spanish: "Yo estaba", translation: "Я была", example: "Yo estaba.", exampleTranslation: "Я была (где-то).", notes: "", difficulty: "A2", tags: ["past tense"] },
      { spanish: "Yo pensaba", translation: "Я думала", example: "Yo pensaba.", exampleTranslation: "Я думала.", notes: "", difficulty: "A2", tags: ["past tense"] },
      { spanish: "Yo tenía", translation: "Я имела", example: "Yo tenía.", exampleTranslation: "У меня было.", notes: "", difficulty: "A2", tags: ["past tense"] }
    ]
  },
  {
    lesson: 8,
    title: "Hecho, apetece, sigue",
    category: "School",
    difficulty: "A2",
    tags: ["verbs", "participle", "school"],
    intro: "Причастие hecho и полезный глагол seguir.",
    authorComment: "Sigue — аналог английского Continue.",
    phrases: [
      { spanish: "Mal hecho", translation: "Плохо сделано", example: "Mal hecho.", exampleTranslation: "Ты поступил плохо.", notes: "Чаще говорят, чтобы сказать, что кто-то поступил плохо.", difficulty: "A2", tags: ["participle"] },
      { spanish: "Bien hecho", translation: "Хорошо сделано", example: "Bien hecho.", exampleTranslation: "Молодец / хорошо сделано.", notes: "", difficulty: "A2", tags: ["participle"] },
      { spanish: "Me apetece", translation: "Мне хочется / нравится", example: "Me apetece.", exampleTranslation: "Мне это по душе.", notes: "", difficulty: "A2", tags: ["opinion"] },
      { spanish: "Sigue", translation: "Продолжай", example: "¡Sigue!", exampleTranslation: "Продолжай!", notes: "Аналог Continue. Обычно побуждение.", difficulty: "A1", tags: ["verbs", "school"] },
      { spanish: "Seguimos", translation: "Продолжаем", example: "Seguimos.", exampleTranslation: "Продолжаем.", notes: "", difficulty: "A2", tags: ["verbs"] },
      { spanish: "Siguiente", translation: "Следующий", example: "Lee lo siguiente.", exampleTranslation: "Прочитай следующее.", notes: "Преподаватель: siguiente — прочитай следующее предложение.", difficulty: "A2", tags: ["school"] }
    ]
  },
  {
    lesson: 9,
    title: "Pide — просить",
    category: "Social Worker",
    difficulty: "A2",
    tags: ["verbs", "requests"],
    intro: "Глагол pedir/pide — просить.",
    authorComment: "Это слово долго меня мучало, наконец закрепилось.",
    phrases: [
      { spanish: "Tú siempre pides hablar", translation: "Ты всё время просишься говорить", example: "Tú siempre pides hablar.", exampleTranslation: "Ты постоянно просишь дать тебе говорить.", notes: "Учитель Хорхе напоминал мне на уроках.", difficulty: "A2", tags: ["requests"] },
      { spanish: "¿Necesito pedir una cita con traductor?", translation: "Нужно назначить встречу с переводчиком?", example: "¿Necesito pedir una cita con traductor?", exampleTranslation: "Нам нужна встреча с переводчиком?", notes: "Психолог спросил на встрече.", difficulty: "B1", tags: ["requests", "appointments"] }
    ]
  },
  {
    lesson: 10,
    title: "Conocido, sabes, siesta, fiesta",
    category: "Daily Life",
    difficulty: "A1",
    tags: ["daily life", "fillers", "culture"],
    intro: "Знакомые люди и популярные (но не всегда полезные) слова.",
    authorComment: "«Sabes» — слово-паразит, чтобы звучать натуральнее.",
    phrases: [
      { spanish: "Conocido", translation: "Знакомый / знакомые", example: "¿Hay alguien conocido contigo?", exampleTranslation: "С тобой есть кто-то знакомый?", notes: "", difficulty: "A2", tags: ["people"] },
      { spanish: "¿Sabes?", translation: "Знаешь?", example: "Me gustan las patatas, ¿sabes?", exampleTranslation: "Мне нравится картошка, знаешь?", notes: "Слово-паразит, можно вставлять везде.", difficulty: "A1", tags: ["fillers"] },
      { spanish: "Siesta", translation: "Сиеста (послеобеденный отдых)", example: "¿Tienes siesta después de comida?", exampleTranslation: "У тебя есть сиеста после еды?", notes: "«Esto es bien para el cerebro».", difficulty: "A1", tags: ["culture"] },
      { spanish: "Fiesta", translation: "Праздник, выходные", example: "En octubre Zaragoza tiene muchas fiestas.", exampleTranslation: "В октябре в Сарагосе много праздников.", notes: "", difficulty: "A1", tags: ["culture"] }
    ]
  },
  {
    lesson: 11,
    title: "Красиво и безобразно",
    category: "Daily Life",
    difficulty: "A1",
    tags: ["describing", "adjectives"],
    intro: "Как сделать комплимент и как выразить негатив.",
    authorComment: "Куда делось «mañana»? На практике чаще говорят «luego».",
    phrases: [
      { spanish: "Bonito", translation: "Красивый", example: "Muy bonito.", exampleTranslation: "Очень красиво.", notes: "Для комплимента.", difficulty: "A1", tags: ["adjectives"] },
      { spanish: "Feo", translation: "Некрасивый / уродливый", example: "Muy feo.", exampleTranslation: "Очень некрасиво.", notes: "Негативное отношение.", difficulty: "A1", tags: ["adjectives"] },
      { spanish: "Luego", translation: "Потом (вместо mañana)", example: "Luego.", exampleTranslation: "Потом.", notes: "Часто говорят «luego» там, где ждёшь «mañana».", difficulty: "A1", tags: ["time"] }
    ]
  },
  {
    lesson: 12,
    title: "Dentro / fuera",
    category: "Housing",
    difficulty: "A1",
    tags: ["prepositions", "housing"],
    intro: "Простые слова «внутри» и «снаружи» облегчают массу ситуаций.",
    authorComment: "Базовые, частые выражения по дому.",
    phrases: [
      { spanish: "Dentro", translation: "Внутри", example: "Está dentro.", exampleTranslation: "Это внутри.", notes: "", difficulty: "A1", tags: ["prepositions"] },
      { spanish: "Fuera", translation: "Снаружи", example: "Está fuera.", exampleTranslation: "Это снаружи.", notes: "", difficulty: "A1", tags: ["prepositions"] },
      { spanish: "Tirar la basura", translation: "Выбросить мусор", example: "Si no lo usáis, lo tiráis.", exampleTranslation: "Если вы это не используете — выбросьте.", notes: "Базовое частое выражение.", difficulty: "A1", tags: ["housing", "chores"] }
    ]
  },
  {
    lesson: 13,
    title: "Как передать чужую речь",
    category: "Daily Life",
    difficulty: "B1",
    tags: ["reported speech", "past tense"],
    intro: "Мастер-ключ, чтобы без церемоний пересказывать чужие слова.",
    authorComment: "Это освоилось у меня на пятом месяце в Испании — топовая разговорная фраза.",
    phrases: [
      { spanish: "Ella me ha dicho que", translation: "Она мне сказала, что", example: "Ella me ha dicho que viene.", exampleTranslation: "Она сказала мне, что придёт.", notes: "Мастер-ключ для пересказа чужой речи.", difficulty: "B1", tags: ["reported speech"] },
      { spanish: "Me han dicho que", translation: "Мне сказали, что", example: "Me han dicho que está cerrado.", exampleTranslation: "Мне сказали, что закрыто.", notes: "Про группу людей — «они мне сказали».", difficulty: "B1", tags: ["reported speech"] }
    ]
  },
  {
    lesson: 14,
    title: "Primero / vez / quedar",
    category: "Restaurant",
    difficulty: "A2",
    tags: ["time", "meeting", "verbs"],
    intro: "Первый и другой раз, а также очень полезный глагол quedar.",
    authorComment: "Quedar — договориться встретиться, задержаться, остаться.",
    phrases: [
      { spanish: "Primera vez", translation: "Первый раз", example: "Es la primera vez.", exampleTranslation: "Это первый раз.", notes: "Otra vez — ещё раз.", difficulty: "A1", tags: ["time"] },
      { spanish: "Quedar", translation: "Остаться / договориться встретиться", example: "¿Podemos quedar en un café?", exampleTranslation: "Можем посидеть в кафе?", notes: "Queda conmigo — побудь со мной.", difficulty: "A2", tags: ["meeting"] },
      { spanish: "Hoy no puedo quedar", translation: "Сегодня не могу задержаться", example: "Hoy no puedo quedar.", exampleTranslation: "Сегодня не могу встретиться / задержаться.", notes: "", difficulty: "A2", tags: ["meeting"] }
    ]
  },
  {
    lesson: 15,
    title: "Me apuntas / me avisas",
    category: "School",
    difficulty: "A2",
    tags: ["school", "pronouns"],
    intro: "Записать и сообщить — с разных сторон.",
    authorComment: "«Me avisas» звучит официальнее, чем «me cuentas».",
    phrases: [
      { spanish: "¿Me apuntas?", translation: "Запишешь меня?", example: "¿Me apuntas?", exampleTranslation: "Запишешь меня (в список)?", notes: "", difficulty: "A2", tags: ["school"] },
      { spanish: "Yo te apunto", translation: "Я тебя запишу", example: "Yo te apunto.", exampleTranslation: "Я тебя запишу.", notes: "Ответственный за группу, если участник выходит.", difficulty: "A2", tags: ["school"] },
      { spanish: "Me avisas", translation: "Сообщишь мне", example: "Me avisas.", exampleTranslation: "Сообщи мне.", notes: "То же, что me cuentas, но официальнее.", difficulty: "A2", tags: ["pronouns"] }
    ]
  },
  {
    lesson: 16,
    title: "Bajar / subir (автобус)",
    category: "Transport",
    difficulty: "A2",
    tags: ["transport", "verbs", "movement"],
    intro: "Входить и выходить из транспорта.",
    authorComment: "Bajar — спускаться, subir — подниматься.",
    phrases: [
      { spanish: "Me bajo", translation: "Я выхожу (из автобуса)", example: "Me bajo aquí.", exampleTranslation: "Я выхожу здесь.", notes: "Выходить из автобуса.", difficulty: "A2", tags: ["transport"] },
      { spanish: "Me subo al autobús", translation: "Я захожу в автобус", example: "Me subo al autobús.", exampleTranslation: "Я сажусь в автобус.", notes: "Me subo al coche — сажусь в машину.", difficulty: "A2", tags: ["transport"] }
    ]
  },
  {
    lesson: 17,
    title: "Recuerdo, montón, vuelvo",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["verbs", "quantity"],
    intro: "Помнить, много и возвращаться.",
    authorComment: "Recuerdo и acuerdo — оба «я помню».",
    phrases: [
      { spanish: "¿Me recuerdas?", translation: "Ты меня помнишь?", example: "¿Me recuerdas?", exampleTranslation: "Ты меня помнишь?", notes: "Te recuerdo — я тебя помню.", difficulty: "A2", tags: ["verbs"] },
      { spanish: "Un montón", translation: "Много / куча", example: "Hay un montón de gente en la calle.", exampleTranslation: "На улице куча народу.", notes: "", difficulty: "A2", tags: ["quantity"] },
      { spanish: "Vuelvo", translation: "Я возвращаюсь / вернусь", example: "Vuelvo.", exampleTranslation: "Я вернусь.", notes: "", difficulty: "A2", tags: ["verbs", "movement"] }
    ]
  },
  {
    lesson: 18,
    title: "A ver / semana que viene",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["fillers", "time"],
    intro: "Слово-паразит «a ver» и как говорить про недели.",
    authorComment: "Полезнее — «¡ve!» (смотри).",
    phrases: [
      { spanish: "A ver", translation: "Давай посмотрим", example: "A ver.", exampleTranslation: "Ну-ка, давай посмотрим.", notes: "Слово-паразит.", difficulty: "A2", tags: ["fillers"] },
      { spanish: "Semana que viene", translation: "Будущая неделя", example: "La semana que viene.", exampleTranslation: "На следующей неделе.", notes: "Можно сказать «la próxima semana».", difficulty: "A2", tags: ["time"] },
      { spanish: "Semana pasada", translation: "Прошедшая неделя", example: "La semana pasada.", exampleTranslation: "На прошлой неделе.", notes: "", difficulty: "A2", tags: ["time"] }
    ]
  },
  {
    lesson: 19,
    title: "Acuerdas / acuérdate",
    category: "School",
    difficulty: "A2",
    tags: ["verbs", "memory"],
    intro: "Помнить и «запомни».",
    authorComment: "Аналогично «tú recuerdas».",
    phrases: [
      { spanish: "¿Tú acuerdas?", translation: "Ты помнишь?", example: "¿Tú te acuerdas?", exampleTranslation: "Ты помнишь?", notes: "", difficulty: "A2", tags: ["memory"] },
      { spanish: "Acuérdate", translation: "Запомни / вспомни", example: "Acuérdate a las 6.", exampleTranslation: "Запомни: в 6.", notes: "Эриола: сегодня в 6 надо вернуться в школу Sopena.", difficulty: "A2", tags: ["memory", "school"] }
    ]
  },
  {
    lesson: 20,
    title: "Con quién / me ofrece",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["questions", "verbs"],
    intro: "Удобная связка «с кем...» и глагол предлагать.",
    authorComment: "Con quién — универсальная связка для вопросов.",
    phrases: [
      { spanish: "¿Con quién?", translation: "С кем?", example: "¿Con quién caminas en el parque?", exampleTranslation: "С кем ты гуляешь в парке?", notes: "Связка: с кем говоришь, дружишь, идёшь.", difficulty: "A2", tags: ["questions"] },
      { spanish: "Me ofrece", translation: "Мне предлагает / я предлагаю", example: "Yo ofrezco usar dos esponjas.", exampleTranslation: "Я предлагаю использовать две губки.", notes: "Помогло объяснить соседке про две губки — для тарелок и для сковородок.", difficulty: "A2", tags: ["verbs"] }
    ]
  },
  {
    lesson: 21,
    title: "Ya / no funciona / voy a",
    category: "Transport",
    difficulty: "A2",
    tags: ["annoying combos", "verbs", "daily life"],
    intro: "Самые надоевшие сочетания, часть 2.",
    authorComment: "«Ya» встречается даже чаще, чем «esta».",
    phrases: [
      { spanish: "¡Ya llegamos!", translation: "Мы уже приехали!", example: "¡Ya llegamos!", exampleTranslation: "Мы уже почти на месте!", notes: "Классика в дороге.", difficulty: "A2", tags: ["transport"] },
      { spanish: "Ya he terminado", translation: "Я уже закончил", example: "Ya he terminado.", exampleTranslation: "Я уже закончил.", notes: "Ответ, если просят что-то сделать.", difficulty: "A2", tags: ["daily life"] },
      { spanish: "Ya tengo hambre", translation: "Я уже проголодался", example: "Ya tengo hambre.", exampleTranslation: "Я уже проголодался.", notes: "", difficulty: "A2", tags: ["daily life"] },
      { spanish: "No funciona", translation: "Не работает", example: "El ascensor no funciona.", exampleTranslation: "Лифт не работает.", notes: "No funciona como es — работает не так, как надо.", difficulty: "A2", tags: ["daily life"] },
      { spanish: "Voy a...", translation: "Я собираюсь / иду...", example: "Voy a comer.", exampleTranslation: "Я собираюсь поесть.", notes: "База для будущего действия.", difficulty: "A1", tags: ["verbs", "future"] }
    ]
  },
  {
    lesson: 22,
    title: "Más o menos / ha ido y vuelto",
    category: "Transport",
    difficulty: "A2",
    tags: ["fillers", "quantity", "transport"],
    intro: "Универсальное «más o menos» и «туда-обратно».",
    authorComment: "По частоте, наверное, второе место после «vale».",
    phrases: [
      { spanish: "Más o menos", translation: "Более-менее", example: "¿Cómo estás? — Más o menos.", exampleTranslation: "Как ты? — Более-менее.", notes: "Можно очень многое выразить: «más o menos 2 kilos».", difficulty: "A1", tags: ["fillers", "quantity"] },
      { spanish: "Ha ido y ha vuelto", translation: "Съездил туда и обратно", example: "El autobús ha ido y ha vuelto.", exampleTranslation: "Автобус съездил туда и обратно.", notes: "Часто при вопросе про дорогу в автобусе.", difficulty: "B1", tags: ["transport", "past tense"] }
    ]
  },
  {
    lesson: 23,
    title: "Arreglar — исправить",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["verbs"],
    intro: "Заровнять, исправить, уладить.",
    authorComment: "Но «arregla tu cara» говорят сердитому человеку.",
    phrases: [
      { spanish: "Arreglar", translation: "Исправить / уладить", example: "¿Cómo podemos arreglarlo?", exampleTranslation: "Как мы можем это уладить?", notes: "Моника использовала это слово.", difficulty: "A2", tags: ["verbs"] },
      { spanish: "Arregla tu cara", translation: "Приведи лицо в порядок", example: "Arregla tu cara.", exampleTranslation: "Не хмурься / приведи лицо в порядок.", notes: "Говорят сердитому человеку.", difficulty: "A2", tags: ["idioms"] }
    ]
  },
  {
    lesson: 24,
    title: "Sabes? — обманчивая простота",
    category: "Transport",
    difficulty: "A2",
    tags: ["questions", "verbs"],
    intro: "Чемпион по краткости — sabes.",
    authorComment: "Одним словом можно спросить многое.",
    phrases: [
      { spanish: "¿En metro sabes?", translation: "Знаешь, как добраться на метро?", example: "¿En metro sabes?", exampleTranslation: "Знаешь, как доехать туда на метро?", notes: "", difficulty: "A2", tags: ["transport", "questions"] },
      { spanish: "¿Sabes inglés?", translation: "Владеешь английским?", example: "¿Sabes hablar inglés?", exampleTranslation: "Ты говоришь по-английски?", notes: "", difficulty: "A2", tags: ["questions"] },
      { spanish: "¿Tú sabes cómo hacer la cama?", translation: "Ты умеешь заправлять кровать?", example: "¿Tú sabes cómo hacer la cama?", exampleTranslation: "Ты знаешь, как заправить кровать?", notes: "Прямое употребление.", difficulty: "A2", tags: ["questions", "chores"] }
    ]
  },
  {
    lesson: 25,
    title: "Sacar / рассказать о фейле",
    category: "Government",
    difficulty: "B1",
    tags: ["documents", "phone", "verbs"],
    intro: "Вынимать/доставать и как рассказать о неудаче.",
    authorComment: "Адриан писал так, когда дозванивался в хостел про мои вещи.",
    phrases: [
      { spanish: "Saca tu NIE", translation: "Достань твой NIE", example: "Saca tu NIE.", exampleTranslation: "Достань своё удостоверение (NIE).", notes: "NIE — внутреннее удостоверение.", difficulty: "A2", tags: ["documents"] },
      { spanish: "Estoy llamando, pero nadie me lo coge", translation: "Я звоню, но никто не берёт трубку", example: "Estoy llamando, pero nadie me lo coge.", exampleTranslation: "Я звоню, но никто не берёт.", notes: "", difficulty: "B1", tags: ["phone"] },
      { spanish: "Seguiré intentándolo", translation: "Я продолжу пробовать", example: "Seguiré intentándolo ahora y por la mañana.", exampleTranslation: "Продолжу пробовать сейчас и утром.", notes: "", difficulty: "B1", tags: ["phone", "future"] },
      { spanish: "En cuanto sepa algo, te escribo", translation: "Как только узнаю — напишу", example: "En cuanto sepa algo, te escribo.", exampleTranslation: "Как только что-то узнаю, напишу тебе.", notes: "", difficulty: "B1", tags: ["future"] }
    ]
  },
  {
    lesson: 26,
    title: "Me cobras / me coincide",
    category: "Restaurant",
    difficulty: "A2",
    tags: ["restaurant", "verbs"],
    intro: "Рассчитаться в кафе и «совпадает».",
    authorComment: "Полезно в кафе и при планировании расписания.",
    phrases: [
      { spanish: "Me cobras", translation: "Рассчитайте меня", example: "¿Me cobras?", exampleTranslation: "Можно счёт / рассчитайте меня?", notes: "В кафе.", difficulty: "A2", tags: ["restaurant"] },
      { spanish: "Me coincide", translation: "У меня совпадает", example: "Me coincide con las clases.", exampleTranslation: "У меня это совпадает с занятиями.", notes: "Расписание курсов совпадает со школой.", difficulty: "A2", tags: ["time"] }
    ]
  },
  {
    lesson: 27,
    title: "Guardar — хранить/отложить",
    category: "Restaurant",
    difficulty: "A2",
    tags: ["verbs", "daily life"],
    intro: "С глаголом guardar много ситуаций.",
    authorComment: "Хранить, беречь, отложить, присмотреть.",
    phrases: [
      { spanish: "Guarda mi comida", translation: "Отложите мою еду", example: "Guarda mi comida.", exampleTranslation: "Отложите мою еду (в хостеле).", notes: "", difficulty: "A2", tags: ["restaurant"] },
      { spanish: "Guárdalo", translation: "Сохрани это", example: "Guárdalo.", exampleTranslation: "Сохрани это.", notes: "", difficulty: "A2", tags: ["daily life"] },
      { spanish: "Guarda mi ordenador", translation: "Присмотри за моим ноутбуком", example: "¿Me guardas el ordenador?", exampleTranslation: "Присмотришь за ноутбуком?", notes: "Обратиться к соседу в Макдональдсе, если надо отойти.", difficulty: "A2", tags: ["daily life"] }
    ]
  },
  {
    lesson: 28,
    title: "Te servirá / responderé",
    category: "Work",
    difficulty: "B1",
    tags: ["work", "future", "verbs"],
    intro: "Полезные конструкции про помощь и будущее.",
    authorComment: "Прошедшее и будущее я учила по ситуациям, добавляя окончания -aba или -é.",
    phrases: [
      { spanish: "Este teléfono te servirá", translation: "Этот телефон тебе поможет", example: "Necesitas cualquier cosa, este teléfono te servirá.", exampleTranslation: "Понадобится что угодно — этот телефон поможет.", notes: "", difficulty: "B1", tags: ["work"] },
      { spanish: "No me respondió, pero responderé", translation: "Мне не ответили, но я отвечу", example: "No me respondió, pero responderé.", exampleTranslation: "Мне не ответили, но я отвечу.", notes: "", difficulty: "B1", tags: ["future", "past tense"] }
    ]
  },
  {
    lesson: 29,
    title: "Venga / cambiar / qué ocurre",
    category: "Work",
    difficulty: "A2",
    tags: ["work", "verbs", "questions"],
    intro: "Позвать, менять, и что происходит.",
    authorComment: "«Cambiar» — очень частое слово.",
    phrases: [
      { spanish: "Venga", translation: "Иди сюда / давай", example: "¡Venga!", exampleTranslation: "Давай, иди сюда!", notes: "Когда надо позвать кого-то.", difficulty: "A1", tags: ["commands"] },
      { spanish: "Cambiar", translation: "Менять / изменять", example: "Quiero cambiar mi horario de trabajo.", exampleTranslation: "Хочу поменять свой рабочий график.", notes: "", difficulty: "A2", tags: ["work"] },
      { spanish: "¿Qué ocurre?", translation: "Что происходит?", example: "¿Qué ocurre?", exampleTranslation: "Что происходит?", notes: "Другой способ сказать «¿Qué pasó?».", difficulty: "A2", tags: ["questions"] }
    ]
  },
  {
    lesson: 30,
    title: "Произношение окончаний",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["pronunciation", "grammar"],
    intro: "Отличие испанского от русского: важно чётко выговаривать окончания слов.",
    authorComment: "Не тот звук — a или o — поменяет «я» на «она».",
    phrases: [
      { spanish: "Yo hablo", translation: "Я говорю", example: "Yo hablo español.", exampleTranslation: "Я говорю по-испански.", notes: "Окончание -o = «я».", difficulty: "A1", tags: ["pronunciation"] },
      { spanish: "Ella habla", translation: "Она говорит", example: "Ella habla español.", exampleTranslation: "Она говорит по-испански.", notes: "Окончание -a = «она». Чётко выговаривайте окончание.", difficulty: "A1", tags: ["pronunciation"] }
    ]
  },
  {
    lesson: 31,
    title: "Me enseñas tus apuntes",
    category: "School",
    difficulty: "A2",
    tags: ["school", "pronouns"],
    intro: "Покажи мне свои заметки — снова Me в начале.",
    authorComment: "Раз Моника так использует — значит, это более употребимо, чем «muéstrame».",
    phrases: [
      { spanish: "Me enseñas tus apuntes", translation: "Покажи мне свои заметки", example: "¿Me enseñas tus apuntes?", exampleTranslation: "Покажешь мне свои конспекты?", notes: "Моника сказала мне так.", difficulty: "A2", tags: ["school"] },
      { spanish: "Muéstrame", translation: "Покажи мне", example: "Muéstrame cómo.", exampleTranslation: "Покажи мне как.", notes: "Раньше говорила так, но «me enseñas» употребимее.", difficulty: "A2", tags: ["pronouns"] }
    ]
  },
  {
    lesson: 32,
    title: "Te falta — тебе не хватает",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["verbs", "daily life"],
    intro: "Конструкция «te falta» — тебе не хватает / ты хочешь ещё.",
    authorComment: "Соседка спросила ночью, когда я читала, а она хотела спать.",
    phrases: [
      { spanish: "¿Te falta más?", translation: "Ты хочешь ещё? / Тебе ещё долго?", example: "¿Te falta más?", exampleTranslation: "Тебе ещё много осталось?", notes: "", difficulty: "A2", tags: ["daily life"] },
      { spanish: "Te falta café", translation: "Тебе не хватает кофе", example: "Te falta café.", exampleTranslation: "Тебе не хватает кофе (ты ещё сонный).", notes: "", difficulty: "A2", tags: ["daily life"] },
      { spanish: "Te falta paciencia", translation: "Тебе не хватает терпения", example: "Te falta paciencia.", exampleTranslation: "Тебе не хватает терпения.", notes: "", difficulty: "A2", tags: ["daily life"] }
    ]
  },
  {
    lesson: 33,
    title: "Tirar / meter / estirar",
    category: "Work",
    difficulty: "B1",
    tags: ["work", "verbs", "chores"],
    intro: "Слова-пары: poner/quitar, meter/sacar, tirar/meter.",
    authorComment: "В рабочем дне горничной это звучит чаще всего.",
    phrases: [
      { spanish: "Tirar", translation: "Натягивать (пододеяльник)", example: "Primero lo tiras.", exampleTranslation: "Сначала натягиваешь.", notes: "В контексте застилания постели.", difficulty: "B1", tags: ["chores"] },
      { spanish: "Meter", translation: "Подворачивать / засовывать", example: "Y pues lo metes.", exampleTranslation: "И потом подворачиваешь под матрас.", notes: "", difficulty: "B1", tags: ["chores"] },
      { spanish: "Estirar", translation: "Разглаживать / потягиваться", example: "Estirar la sábana.", exampleTranslation: "Разгладить простыню.", notes: "Тот же глагол, когда потягиваешься.", difficulty: "B1", tags: ["chores"] }
    ]
  },
  {
    lesson: 34,
    title: "Lo que importa",
    category: "Daily Life",
    difficulty: "B1",
    tags: ["grammar", "lo"],
    intro: "Крутой апгрейд: научиться использовать «lo».",
    authorComment: "Мы говорим через «que», но носителям нужно добавить «lo».",
    phrases: [
      { spanish: "¿Sabes lo que importa?", translation: "Знаешь, что важно?", example: "¿Sabes lo que importa?", exampleTranslation: "Знаешь, что действительно важно?", notes: "«Lo que» = «то, что».", difficulty: "B1", tags: ["lo", "grammar"] },
      { spanish: "Eso es lo que importa", translation: "Вот что важно", example: "Eso es lo que importa.", exampleTranslation: "Вот это и важно.", notes: "", difficulty: "B1", tags: ["lo", "grammar"] }
    ]
  },
  {
    lesson: 35,
    title: "Puede ser / ser + кто-то",
    category: "Work",
    difficulty: "B1",
    tags: ["work", "verbs"],
    intro: "Выражения для темы трудоустройства и объяснений с соцработниками.",
    authorComment: "«Puede ser» хорошо вставлять, когда не уверен.",
    phrases: [
      { spanish: "Puede ser", translation: "Может быть", example: "Puede ser.", exampleTranslation: "Может быть.", notes: "Вставлять, когда не уверены.", difficulty: "A2", tags: ["fillers"] },
      { spanish: "Ser mujer", translation: "Быть женщиной", example: "Ser mujer.", exampleTranslation: "Быть женщиной.", notes: "Ser + кто-то.", difficulty: "A2", tags: ["verbs"] },
      { spanish: "Roto", translation: "Сломан", example: "Tengo la mano rota.", exampleTranslation: "У меня сломана рука.", notes: "Своя специфика при рассказе о себе.", difficulty: "A2", tags: ["health"] }
    ]
  },
  {
    lesson: 36,
    title: "Me sujetas / había / a pie",
    category: "Daily Life",
    difficulty: "B1",
    tags: ["verbs", "past tense", "transport"],
    intro: "Придержать, «было много людей», «пешком занимает».",
    authorComment: "Если делаете ремонт — скажете «me sujetas».",
    phrases: [
      { spanish: "Me sujetas", translation: "Придержи здесь", example: "¿Me sujetas?", exampleTranslation: "Придержишь здесь?", notes: "При ремонте — попросить друга придержать.", difficulty: "A2", tags: ["verbs"] },
      { spanish: "Había mucha gente", translation: "Было много людей", example: "Había mucha gente.", exampleTranslation: "Было много народу.", notes: "Прошедшее время (había).", difficulty: "B1", tags: ["past tense"] },
      { spanish: "A pie se tarda 10 minutos", translation: "Пешком занимает 10 минут", example: "A pie se tarda 10 minutos.", exampleTranslation: "Пешком это 10 минут.", notes: "", difficulty: "B1", tags: ["transport"] }
    ]
  },
  {
    lesson: 37,
    title: "Llevo + герундий",
    category: "Daily Life",
    difficulty: "B1",
    tags: ["grammar", "verbs"],
    intro: "Конструкция llevo + герундий, чтобы звучать как носитель.",
    authorComment: "Со всеми длящимися глаголами можно употреблять llevo.",
    phrases: [
      { spanish: "Llevo esperando", translation: "Я уже жду (какое-то время)", example: "Llevo esperando media hora.", exampleTranslation: "Я жду уже полчаса.", notes: "Я прождал и всё ещё жду.", difficulty: "B1", tags: ["grammar"] },
      { spanish: "Llevo trabajando todo el día", translation: "Я работаю весь день", example: "Llevo trabajando todo el día.", exampleTranslation: "Я работаю уже весь день.", notes: "", difficulty: "B1", tags: ["work"] },
      { spanish: "Llevo viviendo aquí 10 años", translation: "Я живу здесь 10 лет", example: "Llevo viviendo aquí 10 años.", exampleTranslation: "Я живу здесь уже 10 лет.", notes: "", difficulty: "B1", tags: ["grammar"] }
    ]
  },
  {
    lesson: 38,
    title: "En camino / salió el curso",
    category: "Daily Life",
    difficulty: "B1",
    tags: ["movement", "school", "past tense"],
    intro: "«В пути» и как записали на курс по готовке.",
    authorComment: "«Estoy en camino» — я сразу поняла, что Моника едет ко мне.",
    phrases: [
      { spanish: "Estoy en camino", translation: "Я в пути", example: "Estoy en camino.", exampleTranslation: "Я уже еду / в пути.", notes: "Моника позвонила в 8:40 и сказала так.", difficulty: "A2", tags: ["movement"] },
      { spanish: "Salió este curso", translation: "Появился этот курс", example: "Salió este curso que estaba bien.", exampleTranslation: "Появился курс, который был хороший.", notes: "", difficulty: "B1", tags: ["school", "past tense"] },
      { spanish: "Te hemos apuntado", translation: "Мы тебя записали", example: "Te hemos apuntado.", exampleTranslation: "Мы тебя записали (на курс).", notes: "Моника написала, что меня записали на курс по готовке.", difficulty: "B1", tags: ["school"] }
    ]
  },
  {
    lesson: 39,
    title: "Tristemente",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["adverbs", "opinion"],
    intro: "Наречие «грустно», когда что-то не нравится.",
    authorComment: "Валерия говорит так, когда ей что-то не по душе.",
    phrases: [
      { spanish: "Tristemente", translation: "Печально / к сожалению", example: "Tristemente, es así.", exampleTranslation: "К сожалению, это так.", notes: "Грустно думать / жаль, что так.", difficulty: "A2", tags: ["adverbs"] }
    ]
  },
  {
    lesson: 40,
    title: "Tiene razón / tiene sentido",
    category: "Daily Life",
    difficulty: "B1",
    tags: ["opinion", "idioms"],
    intro: "Иметь правоту (о человеке) и иметь смысл (о ситуации).",
    authorComment: "Razón — о точке зрения человека, sentido — о ситуации.",
    phrases: [
      { spanish: "Tiene razón", translation: "Он прав / имеет смысл (точка зрения)", example: "Tiene razón.", exampleTranslation: "Он прав.", notes: "Точка зрения человека имеет смысл.", difficulty: "B1", tags: ["opinion"] },
      { spanish: "Tiene sentido", translation: "Имеет смысл (ситуация)", example: "No tiene sentido ir a ese curso.", exampleTranslation: "Нет смысла идти на этот курс.", notes: "О ситуации, а не о человеке.", difficulty: "B1", tags: ["opinion"] }
    ]
  },
  {
    lesson: 41,
    title: "Me dejan / me dejas",
    category: "Shopping",
    difficulty: "B1",
    tags: ["verbs", "documents", "shopping"],
    intro: "Оставить меня без чего-то и «оставь мне» документ.",
    authorComment: "В одном случае «оставили меня...», в другом «оставь мне».",
    phrases: [
      { spanish: "Me dejan sin bizcocho", translation: "Меня оставили без бисквита", example: "Me dejan sin bizcocho.", exampleTranslation: "Меня оставили без бисквита.", notes: "Росси прибежала на курсах по кухне.", difficulty: "B1", tags: ["food"] },
      { spanish: "Me dejas tu DNI", translation: "Оставь мне твой документ", example: "¿Me dejas tu DNI?", exampleTranslation: "Оставь мне твой ДНИ (удостоверение).", notes: "Кассир в магазине просит удостоверение.", difficulty: "B1", tags: ["documents", "shopping"] }
    ]
  },
  {
    lesson: 42,
    title: "El calentador chupa mucho",
    category: "Housing",
    difficulty: "B1",
    tags: ["housing", "verbs"],
    intro: "Про нагреватель и расход газа.",
    authorComment: "Пропала горячая вода, Валерия запустила нагреватель.",
    phrases: [
      { spanish: "El calentador chupa mucho", translation: "Нагреватель много потребляет", example: "El calentador chupa mucho.", exampleTranslation: "Нагреватель потребляет много газа.", notes: "Нагреватель на газе.", difficulty: "B1", tags: ["housing"] }
    ]
  },
  {
    lesson: 43,
    title: "Me pega mucho",
    category: "Daily Life",
    difficulty: "A2",
    tags: ["idioms", "feelings"],
    intro: "Фраза об усталости.",
    authorComment: "Валерия говорит так, когда сильно устала.",
    phrases: [
      { spanish: "Me pega mucho", translation: "Меня сильно накрывает (усталость)", example: "Me pega mucho.", exampleTranslation: "Меня сильно вырубает / накрывает.", notes: "Когда сильно устала.", difficulty: "A2", tags: ["feelings"] }
    ]
  },
  {
    lesson: 44,
    title: "Nos sigue faltando / recuperar",
    category: "Government",
    difficulty: "B1",
    tags: ["documents", "verbs", "government"],
    intro: "Модель «нам всё ещё не хватает» и «вернуть».",
    authorComment: "Этой модели речи в русском нет, поэтому её сложно перевести напрямую.",
    phrases: [
      { spanish: "Nos sigue faltando un papel", translation: "Нам всё ещё не хватает одного документа", example: "Nos sigue faltando un papel.", exampleTranslation: "Нам так и не хватает одной бумаги.", notes: "Моника написала так.", difficulty: "B1", tags: ["documents"] },
      { spanish: "¿Recuperaste la llave?", translation: "Ты вернула ключ?", example: "¿Recuperaste la llave?", exampleTranslation: "Ты забрала ключ обратно?", notes: "Валерия спросила про ключи.", difficulty: "B1", tags: ["housing"] }
    ]
  },
  {
    lesson: 45,
    title: "Te sientes identificada / se me quema",
    category: "Doctor",
    difficulty: "B1",
    tags: ["feelings", "verbs", "doctor"],
    intro: "Финальный урок: об уверенности в своих словах и «у меня подгорает».",
    authorComment: "После я на улице спрашивала испанцев, что это значит — не все смогли ответить.",
    phrases: [
      { spanish: "¿Te sientes identificada con lo que dices?", translation: "Ты уверена в том, что говоришь?", example: "¿Tú te sientes identificada con lo que dices?", exampleTranslation: "Ты отождествляешь себя с тем, что говоришь?", notes: "Моника спросила на приёме.", difficulty: "B1", tags: ["feelings"] },
      { spanish: "Se me quema", translation: "У меня подгорает", example: "Se me quema en el horno.", exampleTranslation: "У меня подгорает в духовке.", notes: "Лера сказала, когда подгорело.", difficulty: "B1", tags: ["cooking"] }
    ]
  }
]

let count = 0
for (const l of lessons) {
  const phrases = l.phrases.map((p, i) => ({ id: `l${l.lesson}-p${i + 1}`, ...p }))
  const data = { ...l, phrases }
  const name = `lesson${String(l.lesson).padStart(2, "0")}.json`
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2) + "\n", "utf8")
  count++
}
console.log(`Wrote ${count} lessons to ${OUT}`)
