
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { FlowCreateButton } from "./components/flow-create-button"
import { AppShell } from "@/components/shell"
import { AppHeader } from "@/components/header"

export const metadata = {
  title: "Flows",
}

export default async function FlowPage() {

  const flows = []

  return (
    <AppShell>
      <AppHeader heading="Flows" text="Create and manage flows.">
        <FlowCreateButton />
      </AppHeader>
    
    </AppShell>
  )
}
