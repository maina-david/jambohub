import * as React from "react"
import { redirect } from 'next/navigation'
import {
  getCurrentUser,
  getCurrentUserCompanies,
  getCurrentUserSelectedCompany
} from "@/lib/session"

import { AppLayout } from "@/components/app-layout"
import { initializeFacebookSDK } from "@/lib/facebook"

interface AppLayoutProps {
  params: { companyId: string }
  children: React.ReactNode
}

initializeFacebookSDK().then(CompanyLayout)

export default async function CompanyLayout({ params, children }: AppLayoutProps) {
  const user = await getCurrentUser()
  const companies = await getCurrentUserCompanies()
  if (!user) {
    return redirect('/login')
  }

  const company = await getCurrentUserSelectedCompany(params.companyId)

  if (!company) {
    return redirect('/home')
  }

  return (
    <AppLayout user={user} companies={companies}>
      {children}
    </AppLayout>
  )
}
