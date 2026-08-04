import type { Metadata } from "next"
import { SettingsView } from "@/components/app/settings-view"

export const metadata: Metadata = {
  title: "Настройки",
  description: "Настройте тему, дневную цель, систему жизней и полный доступ.",
}

export default function SettingsPage() {
  return <SettingsView />
}
