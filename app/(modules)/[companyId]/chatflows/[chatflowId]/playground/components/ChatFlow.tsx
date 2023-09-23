'use client'

import React, { useEffect, useRef } from 'react'
import Drawflow from 'drawflow'
import 'drawflow/dist/drawflow.min.css'
import StartNode from './nodes/StartNode'
import SendTextNode from './nodes/SendTextNode'
import SendTextNodeWait from './nodes/SendTextWaitNode'
import SendAttachmentNode from './nodes/SendAttachmentNode'
import StopNode from './nodes/StopNode'
import AssignToTeam from './nodes/AssignToTeam'
import { ScrollArea } from '@/components/ui/scroll-area'

const ChatFlow: React.FC = () => {
  const drawflowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (drawflowRef.current) {
      const editor = new Drawflow(drawflowRef.current)
      editor.reroute = true
      editor.drawflow = {
        drawflow: {
          Home: {
            data: {
              // Your Drawflow data here...
            },
          },
          Other: {
            data: {
              // Your Drawflow data here...
            },
          },
        },
      }
      editor.start()

      // Add your Drawflow event listeners here...

      // Functions for adding nodes to Drawflow...

      return () => {
        // Clean up any event listeners or resources if needed.
      }
    }
  }, [])

  return (
    <div className="container h-full py-6">
      <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
        <div className="hidden flex-col space-y-4 sm:flex md:order-2">
          <ScrollArea className='rounded-md border p-4'>
            <StartNode />
            <SendTextNode />
            <SendTextNodeWait />
            <SendAttachmentNode />
            <AssignToTeam />
            <StopNode />
          </ScrollArea>
        </div>
        <div className="md:order-1">
          <div className="flex h-full flex-col space-y-4">
            <div ref={drawflowRef}>
              {/* Your Drawflow container */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatFlow
