import { redirect } from 'next/navigation'
import * as React from "react"
import { getCurrentUser, getCurrentUserCompanies } from "@/lib/session"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function RootLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  const [showNewCompanyDialog, setShowNewCompanyDialog] = React.useState(false)

  if (!user) {
    return redirect('/login')
  }

  // Get the user's companies
  let companies = await getCurrentUserCompanies()

  // Use the find method to get the default company
  const defaultCompany = companies.find(company => company.default === true);

  // If no default company is found, select the first company in the array
  const selectedCompany = defaultCompany || (companies.length > 0 ? companies[0] : null);

  // Now, 'selectedCompany' will hold the default company, or null if no companies are available

  if (selectedCompany) {
    return redirect(`/${selectedCompany.id}`)
  }

  return (
    <>
      {children}
    </>
  )
}
