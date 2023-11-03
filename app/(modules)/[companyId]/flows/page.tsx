
import { FlowCreateDialog } from "./components/flow-create-dialog"
import { AppShell } from "@/components/shell"
import { AppHeader } from "@/components/header"
import ListFlows from "./components/list-flows"

export const metadata = {
  title: "Flows",
}

export default async function FlowPage() {

  return (
    <AppShell>
      <AppHeader heading="Flows" text="Create and manage flows.">
        <FlowCreateDialog />
      </AppHeader>
      <ListFlows />
    </AppShell>
  )
}
