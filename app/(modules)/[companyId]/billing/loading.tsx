import { CardSkeleton } from "@/components/card-skeleton"
import { AppHeader } from "@/components/header"
import { AppShell } from "@/components/shell"

export default function AppBillingLoading() {
  return (
    <AppShell>
      <AppHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </AppShell>
  )
}
