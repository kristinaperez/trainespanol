import assert from "node:assert/strict"
import test from "node:test"
import {
  getDefaultProgressState,
  isLessonLocked,
  normalizeProgressState,
} from "../lib/progress"

test("guest access includes the configured trial lessons", () => {
  assert.equal(isLessonLocked(1, 7, false), false)
  assert.equal(isLessonLocked(7, 7, false), false)
  assert.equal(isLessonLocked(8, 7, false), true)
  assert.equal(isLessonLocked(45, 7, true), false)
})

test("invalid progress snapshots fall back to safe values", () => {
  const normalized = normalizeProgressState({
    xp: -10,
    completedLessons: [1, "2", -3, 8],
    learnedPhrases: ["l1-p1", 42],
    theme: "unknown",
    studentName: "a".repeat(150),
    premiumKey: "LEGACY-KEY",
  })

  assert.equal(normalized.xp, 0)
  assert.deepEqual(normalized.completedLessons, [1, 8])
  assert.deepEqual(normalized.learnedPhrases, ["l1-p1"])
  assert.equal(normalized.theme, "system")
  assert.equal(normalized.studentName.length, 120)
  assert.equal("premiumKey" in normalized, false)
})

test("non-object progress snapshots become a fresh state", () => {
  assert.deepEqual(normalizeProgressState(null), getDefaultProgressState())
})
