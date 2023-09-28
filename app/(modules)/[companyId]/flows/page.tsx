
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
      <div>
        {flows?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {/* {flows.map((flow) => (
              <FlowItem key={flow.id} flow={flow} />
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
