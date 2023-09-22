
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ChatflowHeader } from "./components/header"
import { ChatflowCreateButton } from "./components/chatflow-create-button"
import { ChatflowItem } from "./components/chatflow-item"
import { ChatflowShell } from "./components/shell"

export const metadata = {
  title: "Chatflow",
}

export default async function ChatflowPage() {

  const chatflows = []

  return (
    <ChatflowShell>
      <ChatflowHeader heading="Chatflows" text="Create and manage chatflows.">
        <ChatflowCreateButton />
      </ChatflowHeader>
      <div>
        {chatflows?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {/* {chatflows.map((chatflow) => (
              <ChatflowItem key={chatflow.id} chatflow={chatflow} />
            ))} */}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="flow" />
            <EmptyPlaceholder.Title>No chatflows created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any chatflows yet. Start creating content.
            </EmptyPlaceholder.Description>
            <ChatflowCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </ChatflowShell>
  )
}
