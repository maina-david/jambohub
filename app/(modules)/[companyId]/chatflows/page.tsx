'use client'

import React from 'react'

import Flow from '@/components/Flow'

export const metadata = {
  title: "ChatFlows",
}

function ChatFlowsPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Flow />
    </>
  )
}

export default ChatFlowsPage
