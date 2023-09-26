'use client'

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Separator } from "./ui/separator"
import { PlusIcon, User } from "lucide-react"
import { Button } from "./ui/button"
import { useTeamModal } from "@/hooks/use-team-modal"

export function SideNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const path = usePathname()
  const params = useParams()
  const teamModal = useTeamModal()

  if (!params || !params.companyId) {
    return null
  }

  const companyId = params.companyId

  const routes: SidebarNavItem[] = [
    {
      title: "Dashboard",
      href: `/${companyId}/dashboard`,
      icon: "dashboard",
    },
    {
      title: "Chats",
      href: `/${companyId}/chats`,
      icon: "chat",
    },
    {
      title: "Campaigns",
      href: `/${companyId}/campaigns`,
      icon: "campaign",
    },
    {
      title: "Leads",
      href: `/${companyId}/leads`,
      icon: "activity",
    },
    {
      title: "ChatFlows",
      href: `/${companyId}/chatflows`,
      icon: "flow",
    },
    {
      title: "Channels",
      href: `/${companyId}/channels`,
      icon: "channels",
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {routes.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path?.startsWith(item.href) ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
      <Separator className="my-2" />
      <div className="flex items-center gap-2">
        <span className="group flex items-center px-3 py-2 text-sm font-medium">
          <User className="mr-2 h-4 w-4" /> Teams
        </span>
        <div className="grow"></div>
        <Button onClick={teamModal.onOpen} variant={'ghost'} size={'icon'}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  )
}
