
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { FlowCreateButton } from "./components/flow-create-button"
import { AppShell } from "@/components/shell"
import { AppHeader } from "@/components/header"

export const metadata = {
  title: "Automationflow",
}

export default async function AutomationflowPage() {

  const automationflows = []

  return (
    <AppShell>
      <AppHeader heading="Automationflows" text="Create and manage automationflows.">
        <FlowCreateButton />
      </AppHeader>
      <div>
        {automationflows?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {/* {automationflows.map((automationflow) => (
              <AutomationflowItem key={automationflow.id} automationflow={automationflow} />
            ))} */}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="flow" />
            <EmptyPlaceholder.Title>No automation flows created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any automation flows yet. Start creating flows.
            </EmptyPlaceholder.Description>
            <FlowCreateButton />
          </EmptyPlaceholder>
        )}
      </div>
    </AppShell>
  )
}
