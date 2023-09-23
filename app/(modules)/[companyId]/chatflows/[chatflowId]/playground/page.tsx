import { Metadata } from "next"

import React, { useCallback } from 'react'

import { Separator } from "@/components/ui/separator"

import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"
import { PresetSelector } from "./components/preset-selector"
import { presets } from "./data/presets"

import ChatFlow from "./components/ChatFlow"

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
            <PresetSelector presets={presets} />
            <PresetSave />
            <PresetActions />
          </div>
        </div>
        <Separator />
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <ChatFlow />
          </div>
        </div>
      </div>
    </>
  )
}
