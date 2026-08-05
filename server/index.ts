import cors from "cors"
import express, { type NextFunction, type Request, type Response } from "express"
import Stripe from "stripe"
import { createClient, type User } from "@supabase/supabase-js"
import { z } from "zod"
import { getAllLessons, getLesson } from "../lib/lessons"

const PORT = Number(process.env.PORT ?? 3001)
const FRONTEND_URL = process.env.FRONTEND_URL?.replace(/\/$/, "")
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const COURSE_ID = "espanol-real-full"
const COURSE_PRICE_CENTS = 4900

if (!FRONTEND_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
  throw new Error("Missing required backend environment variables")
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const stripe = new Stripe(STRIPE_SECRET_KEY)
const app = express()

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

app.use(cors({ origin: FRONTEND_URL, methods: ["GET", "POST", "PUT"], allowedHeaders: ["Authorization", "Content-Type"] }))

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ error: "Stripe webhook is not configured" })
    return
  }

  const signature = req.header("stripe-signature")
  if (!signature) {
    res.status(400).json({ error: "Missing Stripe signature" })
    return
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET)
  } catch {
    res.status(400).json({ error: "Invalid Stripe signature" })
    return
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object
      const userId = session.metadata?.user_id
      const courseId = session.metadata?.course_id
      if (!userId || courseId !== COURSE_ID || session.payment_status !== "paid") {
        res.json({ received: true })
        return
      }

      const purchasedAt = new Date(event.created * 1000).toISOString()
      const { error } = await supabase.rpc("grant_course_entitlement", {
        p_event_id: event.id,
        p_event_type: event.type,
        p_user_id: userId,
        p_course_id: COURSE_ID,
        p_customer_id: typeof session.customer === "string" ? session.customer : null,
        p_session_id: session.id,
        p_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
        p_purchased_at: purchasedAt,
      })
      if (error) throw error
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null
      if (paymentIntentId) {
        const { error: eventError } = await supabase.from("stripe_events").insert({ event_id: event.id, event_type: event.type })
        if (!eventError) {
          const { error } = await supabase
            .from("course_entitlements")
            .update({ status: "refunded" })
            .eq("stripe_payment_intent_id", paymentIntentId)
          if (error) throw error
        } else if (eventError.code !== "23505") {
          throw eventError
        }
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook processing failed", error)
    res.status(500).json({ error: "Webhook processing failed" })
  }
})

app.use(express.json({ limit: "256kb" }))

async function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) {
    res.status(401).json({ error: "Authentication required" })
    return
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid session" })
    return
  }

  req.user = data.user
  next()
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.app_metadata?.role !== "admin") {
    res.status(403).json({ error: "Admin access required" })
    return
  }
  next()
}

const progressSchema = z.object({
  state: z.record(z.string(), z.unknown()),
  migrationStatus: z.enum(["imported", "fresh"]),
})

app.get("/health", (_req, res) => res.json({ ok: true }))

app.get("/api/lessons/:id", async (req, res) => {
  const lessonId = Number(req.params.id)
  const lesson = Number.isInteger(lessonId) ? getLesson(lessonId) : undefined
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" })
    return
  }

  if (lessonId > 7) {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "")
    if (!token) {
      res.status(401).json({ error: "Войдите, чтобы открыть полный курс" })
      return
    }
    const { data } = await supabase.auth.getUser(token)
    if (!data.user) {
      res.status(401).json({ error: "Invalid session" })
      return
    }
    const { data: entitlement } = await supabase
      .from("course_entitlements")
      .select("status")
      .eq("user_id", data.user.id)
      .eq("course_id", COURSE_ID)
      .maybeSingle()
    if (entitlement?.status !== "active") {
      res.status(403).json({ error: "Для этого урока нужен полный доступ" })
      return
    }
  }

  const all = getAllLessons()
  const distractors = all
    .filter((item) => Math.abs(item.lesson - lessonId) <= 3)
    .flatMap((item) => item.phrases)
  const index = all.findIndex((item) => item.lesson === lessonId)
  const nextLessonId = index >= 0 && index < all.length - 1 ? all[index + 1].lesson : null
  res.json({ lesson, distractors, nextLessonId })
})

app.get("/api/me", requireUser, async (req, res) => {
  const userId = req.user!.id
  const [{ data: progress, error: progressError }, { data: entitlement, error: entitlementError }] = await Promise.all([
    supabase.from("student_progress").select("state, revision, migration_status, updated_at").eq("user_id", userId).maybeSingle(),
    supabase.from("course_entitlements").select("status, purchased_at").eq("user_id", userId).eq("course_id", COURSE_ID).maybeSingle(),
  ])

  if (progressError || entitlementError) {
    res.status(500).json({ error: "Unable to load account" })
    return
  }

  res.json({
    user: { id: userId, email: req.user!.email, isAdmin: req.user!.app_metadata?.role === "admin" },
    progress,
    hasFullAccess: entitlement?.status === "active",
    entitlement,
  })
})

app.put("/api/progress", requireUser, async (req, res) => {
  const parsed = progressSchema.safeParse(req.body)
  if (!parsed.success || JSON.stringify(parsed.data.state).length > 200_000) {
    res.status(400).json({ error: "Invalid progress payload" })
    return
  }

  const userId = req.user!.id
  const { data: current } = await supabase.from("student_progress").select("revision").eq("user_id", userId).maybeSingle()
  const { data, error } = await supabase
    .from("student_progress")
    .upsert({
      user_id: userId,
      state: parsed.data.state,
      migration_status: parsed.data.migrationStatus,
      revision: (current?.revision ?? 0) + 1,
    })
    .select("revision, updated_at")
    .single()

  if (error) {
    res.status(500).json({ error: "Unable to save progress" })
    return
  }
  res.json(data)
})

app.post("/api/checkout", requireUser, async (req, res) => {
  const parsed = z.object({ requestId: z.string().uuid() }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid checkout request" })
    return
  }

  const userId = req.user!.id
  const { data: entitlement } = await supabase
    .from("course_entitlements")
    .select("status")
    .eq("user_id", userId)
    .eq("course_id", COURSE_ID)
    .maybeSingle()

  if (entitlement?.status === "active") {
    res.status(409).json({ error: "Course is already purchased" })
    return
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      ui_mode: "hosted_page",
      customer_email: req.user!.email,
      success_url: `${FRONTEND_URL}/settings/?payment=success`,
      cancel_url: `${FRONTEND_URL}/settings/?payment=cancelled`,
      integration_identifier: "trainespanol_qwertyui",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: COURSE_PRICE_CENTS,
          product_data: {
            name: "Español Real — полный курс",
            description: "Пожизненный доступ ко всем 45 урокам",
          },
        },
      }],
      metadata: { user_id: userId, course_id: COURSE_ID },
      payment_intent_data: { metadata: { user_id: userId, course_id: COURSE_ID } },
    },
    { idempotencyKey: `checkout:${userId}:${parsed.data.requestId}` },
  )

  res.json({ url: session.url })
})

app.get("/api/admin/students", requireUser, requireAdmin, async (_req, res) => {
  const [{ data: authData, error: authError }, { data: progress, error: progressError }, { data: entitlements, error: entitlementError }] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from("student_progress").select("user_id, state, updated_at"),
    supabase.from("course_entitlements").select("user_id, status, purchased_at").eq("course_id", COURSE_ID),
  ])

  if (authError || progressError || entitlementError) {
    res.status(500).json({ error: "Unable to load students" })
    return
  }

  const progressByUser = new Map(progress.map((row) => [row.user_id, row]))
  const accessByUser = new Map(entitlements.map((row) => [row.user_id, row]))
  const students = authData.users.map((user) => {
    const studentProgress = progressByUser.get(user.id)
    const state = (studentProgress?.state ?? {}) as Record<string, unknown>
    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      xp: typeof state.xp === "number" ? state.xp : 0,
      completedLessons: Array.isArray(state.completedLessons) ? state.completedLessons.length : 0,
      progressUpdatedAt: studentProgress?.updated_at ?? null,
      entitlement: accessByUser.get(user.id) ?? null,
    }
  })

  res.json({ students })
})

app.use((_req, res) => res.status(404).json({ error: "Not found" }))

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Español Real API listening on ${PORT}`)
})
