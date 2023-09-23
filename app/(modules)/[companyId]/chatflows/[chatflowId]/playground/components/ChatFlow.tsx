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
import { Separator } from '@/components/ui/separator'

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
        <div className="flex h-full flex-col space-y-4 md:order-2">
          <ScrollArea className='rounded-md border'>
            <StartNode />
            <Separator className="my-2" />
            <SendTextNode />
            <Separator className="my-2" />
            <SendTextNodeWait />
            <Separator className="my-2" />
            <SendAttachmentNode />
            <Separator className="my-2" />
            <AssignToTeam />
            <Separator className="my-2" />
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
