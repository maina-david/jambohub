import { Metadata } from "next"

import React, { useCallback } from 'react'

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
