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
        <ul>
          {teams.map((team, index) => {
            return (
              <li key={index}>
                <Button
                  className="group flex w-full items-center rounded-lg p-2 text-base text-gray-900 transition duration-75 hover:bg-gray-100  dark:hover:bg-gray-700"
                  aria-controls={`team-dropdown-${team.id}`}
                  data-collapse-toggle={`team-dropdown-${team.id}`}
                >
                  <svg
                    className="h-5 w-5 shrink-0 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span
                    className="ml-3 flex-1 whitespace-nowrap text-left"
                  >
                    {team.name}
                  </span>
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </Button>
                <ul id={`team-dropdown-${team.id}`} className="hidden space-y-2 py-2">
                  <li>
                    <Link
                      href="#"
                      className="group flex w-full items-center rounded-lg p-2 pl-11 transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Members
                    </Link>
                  </li>
                </ul>
              </li>
            )
          })
          }</ul>
      )}
    </nav>
  )
}

async function fetchTeams(companyId: string) {
  const { data } = await axios.get(`/api/companies/${companyId}/teams`)
  return data
}