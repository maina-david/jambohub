'use client'

import React, { useState } from 'react'
import { User } from "next-auth"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Icons } from "./icons"
import { MainNav } from "@/components/main-nav"
import { SideNav } from "@/components/nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import CompanySwitcher from "@/components/company-switcher"
import { dashboardConfig } from "@/config/hub"
import { Company } from "@prisma/client"
import { useMediaQuery } from 'usehooks-ts'
import { MenuIcon } from 'lucide-react'
import Notifications from './notifications'
import { ScrollArea } from './ui/scroll-area'

interface AppLayoutProps {
  user: User
  companies: Company[] | null
  children: React.ReactNode
}

export function AppLayout({
  user,
  companies,
  children,
}: AppLayoutProps) {
  const params = useParams()
  const mdAndAbove = useMediaQuery('(min-width: 768px)')
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          {mdAndAbove ? null : (
            <div className='mr-4' onClick={handleSidebarToggle}>
              <MenuIcon className="h-4 w-4" />
            </div>
          )}
          <Link href={`/${params?.companyId}/dashboard`} className="mr-4 hidden items-center space-x-2 md:flex">
            <Icons.logo />
            <span className="hidden font-bold sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>
          <CompanySwitcher companies={companies} />
          <div className="ml-auto flex items-center space-x-4">
            <MainNav items={dashboardConfig.mainNav} />
            {mdAndAbove && (
              <>
                <ModeToggle />
              </>
            )}
            <Notifications />
            <UserAccountNav
              mdAndAbove={mdAndAbove}
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <ScrollArea className='h-full w-full'>
            <SideNav
              mdAndAbove={mdAndAbove}
              sidebarOpen={sidebarOpen}
              handleSidebarToggle={handleSidebarToggle} />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="grid items-start gap-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
