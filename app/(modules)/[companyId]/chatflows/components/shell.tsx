import * as React from "react"

import { cn } from "@/lib/utils"

interface ChatflowShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ChatflowShell({
  children,
  className,
  ...props
}: ChatflowShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  )
}
