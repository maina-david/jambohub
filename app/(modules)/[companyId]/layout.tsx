import * as React from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Link from "next/link"
import { Icons } from "@/components/icons"
import { dashboardConfig } from "@/config/hub"
import { redirect } from 'next/navigation'
import { getCurrentUser, getCurrentUserCompanies, getCurrentUserSelectedCompany } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { SideNav } from "@/components/nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import CompanySwitcher from "@/components/company-switcher"

interface CompanyLayoutProps {
  children?: React.ReactNode
  params: { companyId: string }
}

export default async function CompanyLayout({
  children,
  params,
}: CompanyLayoutProps) {
  const user = await getCurrentUser()
  const companies = await getCurrentUserCompanies()
  if (!user) {
    return redirect('/login')
  }

  const company = await getCurrentUserSelectedCompany(params.companyId)

  if (!company) {
    return redirect('/home')
  }

  // Create a client
  const queryClient = new QueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col space-y-6">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <Link href={`/${params.companyId}/dashboard`} className="mr-4 hidden items-center space-x-2 md:flex">
              <Icons.logo />
              <span className="hidden font-bold sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
            <CompanySwitcher items={companies} />
            <div className="ml-auto flex items-center space-x-4">
              <MainNav items={dashboardConfig.mainNav} />
              <ModeToggle />
              <UserAccountNav
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
            <SideNav />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            <div className="grid items-start gap-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}
