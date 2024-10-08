'use client'

import { AppShell } from "@/components/shell"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { AppHeader } from "@/components/header"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import axios from "axios"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import CustomersSkeleton from "./_components/customers-skeleton"
import CustomerDialog from "./_components/CustomerDialog"
import { Customer } from "@prisma/client"

const fetchCustomers = (companyId: string): Promise<Customer[]> =>
  axios.get(`/api/companies/${companyId}/customers`).then((response) => response.data)

export default function UsersPage() {
  const params = useParams()
  const companyId = params?.companyId

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['companyCustomers'],
    queryFn: () => fetchCustomers(companyId as string),
  })

  if (isLoading) {
    return <CustomersSkeleton />
  }

  if (isError) {
    console.log("Error fetching channels:", error)
    if (error instanceof Error) {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {error.message}
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    } else {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            An error occurred while fetching customers.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }
  }

  return (
    <AppShell>
      <AppHeader heading="Customers" text="Manage your customers here.">
        <CustomerDialog />
      </AppHeader>
      <DataTable columns={columns} data={data} />
    </AppShell>
  )
}
