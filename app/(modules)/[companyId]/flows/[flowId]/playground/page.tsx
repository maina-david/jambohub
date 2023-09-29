import { Metadata } from "next"

import React, { useCallback } from 'react'

import { Separator } from "@/components/ui/separator"

import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"

import Flow from "./components/Flow"

export const metadata: Metadata = {
  title: "Playground",
}

export default function PlaygroundPage() {
  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSave />
            <PresetActions />
          </div>
        </div>
        <Separator />
        <Flow />
      </div>
    </>
  )
}
