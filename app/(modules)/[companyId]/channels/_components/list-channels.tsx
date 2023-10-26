'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ChannelCard } from './channel-card'
import { useParams } from 'next/navigation'
import ChannelSkeleton from './channel-skeleton'
import { fetchChannels } from '@/actions/channel-actions'
import { AnimatePresence, motion } from 'framer-motion'

export default function ListChannels() {
  const params = useParams()
  const companyId = params?.companyId

  const { isLoading, isError, data: channels, error } = useQuery({
    queryKey: ['companyChannels'],
    queryFn: () => fetchChannels(companyId as string),
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <ChannelSkeleton key={index} />
        ))}
      </div>
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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  }
  
  return (
    <>
      {channels.length ? (
        <AnimatePresence>
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {channels.map((channel, index) => {
              return <ChannelCard key={index} channel={channel} />
            })}
          </motion.ul>
        </AnimatePresence>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="channels" />
          <EmptyPlaceholder.Title>No channels integrated</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any channels yet. Start integrating.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </>
  )
}
