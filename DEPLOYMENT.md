# Развёртывание Español Real

Архитектура: статический Next.js frontend на Cloudflare Pages, Express API на Render Free, Supabase для Auth/Postgres и Stripe Checkout для разовой оплаты.

## 1. Render API

Создайте Blueprint из `render.yaml`. Для сервиса `trainespanol-api` задайте:

- `FRONTEND_URL` — итоговый адрес Cloudflare Pages без завершающего `/`;
- `SUPABASE_URL`;
- `SUPABASE_SERVICE_ROLE_KEY`;
- `STRIPE_SECRET_KEY`;
- `STRIPE_WEBHOOK_SECRET` — создаётся на следующем шаге.

После первого деплоя проверьте `https://<render-host>/health`: ответ должен быть `{"ok":true}`.

## 2. Stripe

Создайте webhook endpoint:

`https://<render-host>/api/stripe/webhook`

Подпишите события:

- `checkout.session.completed`;
- `checkout.session.async_payment_succeeded`;
- `charge.refunded`.

Скопируйте signing secret (`whsec_…`) в `STRIPE_WEBHOOK_SECRET` сервиса Render. Цена и товар создаются сервером: 49 EUR, количество всегда равно 1; webhook атомарно выдаёт или отзывает доступ.

## 3. Cloudflare Pages

Подключите репозиторий и выберите:

- build command: `pnpm build`;
- output directory: `out`;
- Node.js: `22`.

Build-time переменные:

- `NEXT_PUBLIC_API_URL=https://<render-host>`;
- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (или `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Файл `public/_headers` добавляет базовые защитные заголовки. Платные уроки не включаются в статический export и выдаются только API после проверки Supabase JWT и entitlement.

## 4. Supabase Auth

Добавьте production URL Cloudflare Pages в разрешённые redirect URL, включая:

`https://<cloudflare-host>/auth/callback/`

Magic link возвращает пользователя на этот callback, где PKCE-код обменивается на сессию. Данные прогресса защищены RLS; сервисный ключ используется только backend-сервисом.

## 5. Администратор

Сначала войдите нужным email через приложение, затем назначьте роль из окружения с service-role переменными:

```bash
pnpm admin:role owner@example.com admin
```

Удаление роли:

```bash
pnpm admin:role owner@example.com remove
```

После повторного входа раздел `/admin/` покажет учеников, XP, завершённые уроки и статус покупки.

## Проверка перед запуском

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
```

Для тестовой покупки сначала используйте Stripe test mode. Проверьте успешную оплату, повторный webhook (доступ не дублируется) и полный возврат (доступ становится `refunded`).
