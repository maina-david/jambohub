import { Card } from "@/components/ui/card"
import { CardSkeleton } from "@/components/card-skeleton"
import { AppHeader } from "@/components/header"
import { AppShell } from "@/components/shell"

export default function AppSettingsLoading() {
  return (
    <AppShell>
      <AppHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </AppShell>
  )
}
