"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> { }

export function TeamSidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const params = useParams()
  const sidebarNavItems = [
    {
      title: "Members",
      href: `/${params?.companyId}/teams/${params?.teamId}/members`,
    },
    {
      title: "Settings",
      href: `/${params?.companyId}/teams/${params?.teamId}/settings`,
    },
  ]

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "mr-2 justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
