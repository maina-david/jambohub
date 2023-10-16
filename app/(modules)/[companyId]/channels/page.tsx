import React from 'react'
import { AppShell } from '@/components/shell'
import { AppHeader } from '@/components/header'
import ListChannels from './_components/list-channels'
import LinkChannelDropdown from './_components/LinkChannelDropdown'

export const metadata = {
  title: "Channels",
}

export default async function ChannelsPage() {
  return (
    <AppShell>
      <AppHeader heading='Channels' text='Create and manage communication channels'>
        <LinkChannelDropdown />
      </AppHeader>
      <ListChannels />
    </AppShell>
  )
}
