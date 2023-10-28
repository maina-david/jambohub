'use client'

import { Textarea } from '@/components/ui/textarea'
import React, { useRef, useEffect } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '@/store/flowStore'
import { Input } from '@/components/ui/input'

function SendTextResponseNode({ id, data }: NodeProps) {
  const updateReplyOption = useStore((state) => state.updateReplyOption)
  const updateSendTextValue = useStore((state) => state.updateSendTextValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    adjustTextareaHeight()
  }, [updateSendTextValue])

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="flex w-64 rounded border border-stone-400 p-2 shadow-md">
      <div className='grid w-full gap-2'>
        <Input placeholder='Enter reply option' value={data.replyOption} onChange={(evt) => updateReplyOption(id, evt.target.value, 'replyOption')} />
        <Textarea
          value={data.value}
          placeholder='Type your message here'
          onChange={(evt) => {
            updateSendTextValue(id, evt.target.value)
            adjustTextareaHeight()
          }}
          className="nodrag"
          ref={textareaRef}
        />
      </div>
      <Handle type="target" position={Position.Top} className="w-10 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-10 bg-teal-500" />
    </div>
  )
}

export default SendTextResponseNode

