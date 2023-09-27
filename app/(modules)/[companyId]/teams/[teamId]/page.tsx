import React from 'react'
import { AppShell } from '@/components/shell'
import { Separator } from '@/components/ui/separator'

export const metadata = {
  title: "Team",
}

export default async function TeamPage() {

  return (
    <AppShell>
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h2
            className="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
            {/* editable header name */}
          </h2>
          {/* header text */}
        </div>
        {/* app content */}
      </div>
      <Separator />
    </AppShell>
  )
}
