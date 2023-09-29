import { Metadata } from "next"


import Flow from "./components/Flow"

export const metadata: Metadata = {
  title: "Playground",
}

export default function PlaygroundPage() {
  return (
    <>
      <Flow />
    </>
  )
}
