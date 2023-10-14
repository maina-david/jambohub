'use client'

import React, { useState } from 'react'
import SideBarLeft from './SideBarLeft'
import ChatContentArea from './ChatContentArea'
import { useMediaQuery } from 'usehooks-ts'

export default function ChatArea(user: any) {
  const isMdAndAbove = useMediaQuery('(min-width: 768px)')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <>
      {/* Sidebar Left */}
      <SideBarLeft
        user={user}
        isMdAndAbove={isMdAndAbove}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle} />
      {/* Sidebar Left*/}

      {/* ChatContent */}
      <ChatContentArea
        isMdAndAbove={isMdAndAbove}
        handleLeftSidebarToggle={handleLeftSidebarToggle} />
      {/* ChatContent */}
    </>
  )
}
