
import { FlowCreateButton } from "./components/flow-create-button"
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
        <FlowCreateButton />
      </AppHeader>
      <ListFlows />
    </AppShell>
  )
}
