import { notFound } from "next/navigation"

import { getChatflowDetails } from "@/lib/session"

interface PlaygroundLayoutProps {
  children: React.ReactNode
  params: { chatflowId: string }
}

export default function PlaygroundLayout({ children, chatflowId }: PlaygroundLayoutProps) {
  // const chatflow = await getChatflowDetails(params.chatflowId)

  // if (!chatflow) {
  //   return notFound()
  // }

  return <div className="min-h-screen">{children}</div>
}
