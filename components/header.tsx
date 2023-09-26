'use client'

import { Separator } from "./ui/separator"

interface AppHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function AppHeader({
  heading,
  text,
  children,
}: AppHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h2 className="font-heading text-3xl md:text-4xl">{heading}</h2>
          {text && <p className="text-lg text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
      <Separator/>
    </>
  )
}
