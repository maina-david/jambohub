import { notFound } from "next/navigation"

interface PlaygroundLayoutProps {
  children: React.ReactNode
  params: { flowId: string }
}

export default function PlaygroundLayout({ children }: PlaygroundLayoutProps) {
  // const flow = await getFlowDetails(params.flowId)

  // if (!flow) {
  //   return notFound()
  // }

  return <div className="min-h-screen">{children}</div>
}
