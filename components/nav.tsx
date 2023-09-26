'use client'

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import axios from "axios"
import { useQuery } from '@tanstack/react-query'
import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Separator } from "./ui/separator"
import { PlusIcon, User } from "lucide-react"
import { Button } from "./ui/button"
import { useTeamModal } from "@/hooks/use-team-modal"
import { Skeleton } from "./ui/skeleton"

export function SideNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const path = usePathname()
  const params = useParams()
  const teamModal = useTeamModal()

  const companyId = params?.companyId

  const { isLoading, isSuccess, isError, data: teams, error } = useQuery({
    queryKey: ['companyTeams'],
    queryFn: () => fetchTeams(companyId as string),
  })

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
      {isLoading && (
        <>
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[200px]" />
        </>
      )}
      {isError && (
        <div className="flex items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.warning className="h-10 w-10" />
          </div>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            Error fetching teams
          </p>
        </div>
      )}
      {isSuccess && (
        teams.map((team, index) => {
          return (
            <Link key={index} href={`${companyId}/teams/${team.id}`}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path?.startsWith(`${companyId}/teams/${team.id}`) ? "bg-accent" : "transparent"
                )}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{team.name}</span>
              </span>
            </Link>
          )
        })
      )}
    </nav>
  )
}

async function fetchTeams(companyId: string) {
  const { data } = await axios.get(`/api/companies/${companyId}/teams`)
  return data
}