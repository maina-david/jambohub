"use client"

import * as React from "react"
import Link from "next/link"
import {
  useSelectedLayoutSegment,
  useParams,
  usePathname
} from "next/navigation"

import { MainNavItem } from "types"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: MainNavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  
  return (
    <div className="flex gap-6 md:gap-10">
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(`/${segment}`)
                  ? "text-foreground"
                  : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}

        </nav>
      ) : null}
    </div>
  )
}
