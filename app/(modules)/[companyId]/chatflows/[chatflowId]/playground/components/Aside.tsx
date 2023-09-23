import React from 'react'
import SendAttachment from './SendAttachment'
import SendText from './SendText'
import SendTextWait from './SendTextWait'
import StartNode from './StartNode'

export default function Aside() {
  return (
    <div className="hidden flex-col space-y-4 sm:flex md:order-2">
      <StartNode />
      <SendText />
      <SendTextWait />
      <SendAttachment />
    </div>
  )
}
