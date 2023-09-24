import { db } from '@/lib/db'
import React from 'react'

export const metadata = {
  title: "Channels",
}

const ChannelsPage = async ({ params }: { params: { companyId: string } }) => {
  const channels = await db.channel.findMany({
    where: {
      companyId: params.companyId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return (
    <div>ChannelsPage</div>
  )
}

export default ChannelsPage
