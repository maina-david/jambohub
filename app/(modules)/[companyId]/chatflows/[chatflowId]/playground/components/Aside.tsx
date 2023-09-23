import React from 'react'
import SendAttachment from './nodes/SendAttachmentNode'
import SendText from './nodes/SendTextNode'
import SendTextWait from './nodes/SendTextWaitNode'
import StartNode from './nodes/StartNode'

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
