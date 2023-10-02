import { AppShell } from "@/components/shell"
import { Payment, columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { AppHeader } from "@/components/header"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
]


export default function UsersPage() {
  return (
    <AppShell>
      <AppHeader heading="Customers" text="Create and manage customers and leads">
        <DataTable columns={columns} data={data} />
      </AppHeader>
    </AppShell>
  )
}
