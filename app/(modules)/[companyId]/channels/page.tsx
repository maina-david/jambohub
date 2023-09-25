import React from 'react'
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ChannelCard } from './_components/channel-card'
import ChannelModal from './_components/channel-modal'
import { getCompanyChannels } from '@/actions/channel-actions'
import { AppShell } from '@/components/shell'
import { AppHeader } from '@/components/header'

export const metadata = {
  title: "Channels",
}

const ChannelsPage = async ({ params }: { params: { companyId: string } }) => {
  const channels = await getCompanyChannels(params.companyId)

  return (
    <AppShell>
      <AppHeader heading='Channels' text='Create and manage communication channels'>
        <ChannelModal />
      </AppHeader>
      <>
        {channels.length ? (
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex items-center space-x-2">
                <ChannelModal />
              </div>
            </div>
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((channel, index) => {
                return <ChannelCard key={index} channel={channel} />
              })}
            </ul>
          </div>
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
    </AppShell>
  )
}

export default ChannelsPage
