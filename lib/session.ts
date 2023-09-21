import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { User } from "next-auth"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}

export async function getCurrentUserCompanies() {
  const user = (await getCurrentUser()) as User

  const companies = await db.company.findMany({
    where: {
      ownerId: user.id,
    },
  })
  
  return companies
}
