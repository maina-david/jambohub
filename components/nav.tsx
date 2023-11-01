'use client'

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useQuery } from '@tanstack/react-query'
import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Separator } from "./ui/separator"
import { PlusIcon, Users2 } from "lucide-react"
import { Button } from "./ui/button"
import { useTeamModal } from "@/hooks/use-team-modal"
import { Skeleton } from "./ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { siteConfig } from "@/config/site"
import { Team } from "@prisma/client"
import { Key } from "react"
import { Sheet, SheetContent } from "./ui/sheet"
import { fetchTeams } from "@/actions/team-actions"
import { getCurrentUserSubscription } from "@/actions/user-actions"
import { AnimatePresence, motion } from "framer-motion"

interface SideNavProps {
  mdAndAbove: boolean,
  sidebarOpen: boolean,
  handleSidebarToggle: () => void
}
export function SideNav(props: SideNavProps) {
  const {
    mdAndAbove,
    sidebarOpen,
    handleSidebarToggle
  } = props
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
    // {
    //   title: "Campaigns",
    //   href: `/${companyId}/campaigns`,
    //   icon: "campaign",
    //   disabled: true
    // },
    {
      title: "Customers",
      href: `/${companyId}/customers`,
      icon: "users",
    },
    {
      title: "Flows",
      href: `/${companyId}/flows`,
      icon: "flow",
    },
    {
      title: "Channels",
      href: `/${companyId}/channels`,
      icon: "channels",
    },
  ]

  const handleMobileSidebar = () => {
    if (!mdAndAbove) {
      handleSidebarToggle()
    }
  }

  const sidebar = {
    open: {
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2
      }
    },
    closed: {
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  }

  const ulVariants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const liVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: {
          stiffness: 1000,
          velocity: -100
        }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: {
          stiffness: 1000
        }
      }
    }
  }
  const renderSideNav = () => {
    return (
      <AnimatePresence>
        <motion.nav
          initial="closed"
          animate="open"
          className="grid items-start"
        >
          <motion.div variants={sidebar} />

          <motion.ul
            variants={ulVariants}>
            {routes.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"]
              return (
                item.href && (
                  <motion.li
                    variants={liVariants}
                  >
                    <Link
                      key={index}
                      href={item.disabled ? "/" : item.href}
                      onClick={handleMobileSidebar}
                    >
                      <div
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-sky-500",
                          path?.startsWith(item.href) ? "bg-accent text-sky-500" : "transparent",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  </motion.li>
                )
              )
            })}
          </motion.ul>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <span className="flex items-center px-3 py-2 text-sm font-medium">
              Teams
            </span>
            <div className="grow"></div>
            <Button onClick={teamModal.onOpen} variant={'ghost'} size={'icon'}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          {isLoading && (
            <Skeleton className="h-4 w-[150px]" />
          )}
          {isError && (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Icons.warning className="h-10 w-10" />
              </div>
            </div>
          )}
          {isSuccess && (
            teams.map((team: Team, index: Key | null | undefined) => {
              return (
                <Link key={index} href={`/${companyId}/teams/${team.id}/members`}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-sky-500",
                      path?.startsWith(`/${companyId}/teams/${team.id}`) ? "bg-accent text-sky-500" : "transparent"
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
            subscription.data.plan === 'FREE' ? (
              <Card className="rounded-lg shadow-2xl">
                <CardHeader>
                  <CardTitle>
                    Try {siteConfig.name} Pro
                  </CardTitle>
                  <CardDescription>
                    Get unlimited teams, automation flows, channels, and more
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start justify-center">
                  <Link
                    href={'#'}
                    className="text-sm font-medium leading-none underline underline-offset-1"
                  >
                    Upgrade now
                  </Link>
                </CardContent>
              </Card>
            ) : subscription.data.plan === 'PRO' && (
              <Card className="rounded-lg shadow-2xl">
                <CardHeader>
                  <CardTitle>
                    {subscription.data.plan.toLocaleLowerCase()}
                  </CardTitle>
                  <CardDescription>
                    {subscription.data.currentPeriodEnd && (
                      <>
                        Subscription ending on {new Date(subscription.data.currentPeriodEnd).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start justify-center">
                  <Link
                    href={'#'}
                    className="text-sm font-medium leading-none underline underline-offset-1"
                  >
                    Renew subscription
                  </Link>
                </CardContent>
              </Card>
            )
          )}
        </motion.nav>
      </AnimatePresence>
    )
  }

  return mdAndAbove ? renderSideNav() : (
    <Sheet open={sidebarOpen} onOpenChange={handleSidebarToggle}>
      <SheetContent side={'left'}>
        {renderSideNav()}
      </SheetContent>
    </Sheet>
  )
}
