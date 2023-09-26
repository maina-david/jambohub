import React from 'react'
import ChannelModal from './_components/channel-modal'
import { AppShell } from '@/components/shell'
import { AppHeader } from '@/components/header'
import ListChannels from './_components/list-channels'

export const metadata = {
  title: "Channels",
}

export default async function ChannelsPage() {

  return (
    <AppShell>
      <AppHeader heading='Channels' text='Create and manage communication channels'>
        <ChannelModal />
      </AppHeader>
      <ListChannels />
    </AppShell>
  )
}
