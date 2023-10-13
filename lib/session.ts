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

  if (user) {
    const companies = await db.company.findMany({
      where: {
        ownerId: user.id,
      },
    })

    return companies
  } else {
    return null
  }
}

export async function getCurrentUserSelectedCompany(companyId: string) {
  const user = (await getCurrentUser()) as User
  if (user) {
    const company = await db.company.findFirst({
      where: {
        id: companyId,
        ownerId: user.id,
      }
    }
    )

    return company
  } else {
    return null
  }
}

export async function validateCompanyTeam(companyId: string, teamId: string) {
  const user = (await getCurrentUser()) as User
  if(user){
    const company = await db.company.findFirst({
      where: {
        id: companyId,
        ownerId: user.id,
      }
    }
    )

    if (!company) {
      return null
    }

    const teamCount = await db.team.count({
      where: {
        id: teamId,
        companyId: companyId
      }
    })

    return teamCount > 0
  }else{
    return null
  }
}
