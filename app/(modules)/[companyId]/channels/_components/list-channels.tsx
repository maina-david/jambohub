'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Channel } from '@prisma/client'
import { getCompanyChannels } from '@/actions/channel-actions'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ChannelCard } from './channel-card'
import ChannelModal from './channel-modal'
import { useParams } from 'next/navigation'
import ChannelSkeleton from './channel-skeleton'

export default function ListChannels() {
  const params = useParams()
  const companyId = params?.companyId
  const { isLoading, isError, data: channels, error } = useQuery<Channel[]>({
    queryKey: ["companyChannels"],
    queryFn: () => getCompanyChannels(companyId as string),
  })

  if (isLoading) {
    return (
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <ChannelSkeleton key={index} />
        ))}
      </ul>
    )
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
            An error occurred while fetching channels.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }
  }

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
