import { Metadata } from "next"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import React, { useCallback } from 'react'

import { Separator } from "@/components/ui/separator"

import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"

import ChatFlow from "./components/ChatFlow"

export const metadata: Metadata = {
  title: "Playground",
}

export default function PlaygroundPage() {
  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              'mr-4'
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          </Link>
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSave />
            <PresetActions />
          </div>
        </div>
        <Separator />
        <ChatFlow />
      </div>
    </>
  )
}
