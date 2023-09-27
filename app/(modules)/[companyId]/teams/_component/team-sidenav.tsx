"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> { }

export function TeamSidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const params = useParams()
  const sidebarNavItems = [
    {
      title: "Settings",
      href: `/${params?.companyId}/teams/${params?.teamId}/settings`,
      icon: "settings"
    },
    {
      title: "Members",
      href: `/${params?.companyId}/teams/${params?.teamId}/members`,
      icon: "users"
    }
  ]

  return (
    <nav
      className={cn(
        "ml-4 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {sidebarNavItems.map((item) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            <Icon className="mr-2 h-4 w-4" /> {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
