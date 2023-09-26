'use client'

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import axios from "axios"
import { useQuery } from '@tanstack/react-query'
import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Separator } from "./ui/separator"
import { PlusIcon, User, Users2 } from "lucide-react"
import { Button, buttonVariants } from "./ui/button"
import { useTeamModal } from "@/hooks/use-team-modal"
import { Skeleton } from "./ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { siteConfig } from "@/config/site"

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

  const subscription = useQuery({
    queryKey: ['userSubscription'],
    queryFn: () => getCurrentUserSubscription(),
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
    <nav className="grid items-start gap-2" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          Teams
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
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icons.warning className="h-10 w-10" />
          </div>
        </div>
      )}
      {isSuccess && (
        teams.map((team, index) => {
          return (
            <Link key={index} href={`/${companyId}/teams/${team.id}`}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path?.startsWith(`/${companyId}/teams/${team.id}`) ? "bg-accent" : "transparent"
                )}
              >
                <Users2 className="mr-2 h-4 w-4" />
                <span>{team.name}</span>
              </span>
            </Link>
          )
        })
      )}
      <div className="grow"></div>
      {subscription.isSuccess && (
        subscription.data.plan === 'FREE' && (
          <Card className="rounded-lg shadow-2xl">
            <CardHeader>
              <CardTitle>Try {siteConfig.name} Pro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Get unlimited channels, chatflows, teams, and more
              </p>
              <Link
                href={'#'}>
                Upgrade now
              </Link>
            </CardContent>
          </Card>
        )
      )}
    </nav>
  )
}

async function fetchTeams(companyId: string) {
  const { data } = await axios.get(`/api/companies/${companyId}/teams`)
  return data
}

async function getCurrentUserSubscription() {
  const { data } = await axios.get(`/api/users/subscription`)
  return data
}