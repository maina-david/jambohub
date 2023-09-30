import { Metadata } from "next"
import AutomationFlow from "./components/AutomationFlow"

export const metadata: Metadata = {
  title: "Playground",
}

export default function PlaygroundPage() {
  return (
    <>
      <AutomationFlow />
    </>
  )
}
