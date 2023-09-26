'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Channel } from '@prisma/client'
import { getCompanyChannels } from '@/actions/channel-actions'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ChannelCard } from './channel-card'
import ChannelModal from './channel-modal'
import { useParams } from 'next/navigation'

function ListChannels() {
  const params = useParams()
  const companyId = params?.companyId
  const { data: channels } = useQuery(['companyChannels', companyId], () =>
    getCompanyChannels(companyId as string)
  ) as { data: Channel[] }

  return (
    <>
      {channels.length ? (
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel, index) => {
            return <ChannelCard key={index} channel={channel} />
          })}
        </ul>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="channels" />
          <EmptyPlaceholder.Title>No channels created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any channels yet. Start integrating.
          </EmptyPlaceholder.Description>
          <ChannelModal />
        </EmptyPlaceholder>
      )}
    </>
  )
}

export default ListChannels
