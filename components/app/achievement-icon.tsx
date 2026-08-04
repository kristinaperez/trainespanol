import {
  Check,
  CheckCheck,
  Flame,
  Star,
  BookOpen,
  ShieldCheck,
  Milestone,
  Trophy,
  GraduationCap,
  Sparkles,
  Award,
} from "lucide-react"

const MAP = {
  Check,
  CheckCheck,
  Flame,
  Star,
  BookOpen,
  ShieldCheck,
  Milestone,
  Trophy,
  GraduationCap,
  Sparkles,
} as const

export function AchievementIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (MAP as Record<string, typeof Award>)[name] ?? Award
  return <Icon className={className} />
}
