
import React from 'react'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import ChannelCard from './_components/channel-card'
import AddChannelModal from './_components/add-channel-modal'
import { getCompanyChannels } from '@/actions/channel-actions'

export const metadata = {
  title: "Channels",
}

const ChannelsPage = async ({ params }: { params: { companyId: string } }) => {
  const channels = await getCompanyChannels(params.companyId)

  return (
    <>
      {channels.length ? (
        channels.map((channel, index) => {
          return <ChannelCard key={index} data={channel} />
        })
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
