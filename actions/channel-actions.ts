import { db } from "@/lib/db"

export async function getCompanyChannels(companyId: string) {

  const channels = await db.channel.findMany({
    where: {
      companyId: companyId
    }
  })

  return channels
}
