import { User } from "next-auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function getCurrentUserCompanyChannels(companyId: string) {
  const user = (await getCurrentUser()) as User

  const channels = await db.channel.findMany({
    where: {
      companyId: companyId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return channels
}
