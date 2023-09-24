
import React from 'react'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ChannelCard } from './_components/channel-card'
import AddChannelModal from './_components/add-channel-modal'
import { getCompanyChannels } from '@/actions/channel-actions'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export const metadata = {
  title: "Channels",
}

const ChannelsPage = async ({ params }: { params: { companyId: string } }) => {
  const channels = await getCompanyChannels(params.companyId)

  return (
    <>
      {channels.length ? (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center space-x-2">
              <AddChannelModal />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel, index) => {
              return <ChannelCard key={index} data={channel} />
            })}
          </div>
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="channels" />
          <EmptyPlaceholder.Title>No channels created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any channels yet. Start integrating.
          </EmptyPlaceholder.Description>
          <AddChannelModal />
        </EmptyPlaceholder>
      )}
    </>
  )
}

export default ChannelsPage
