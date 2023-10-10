'use client'

import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useRef, useEffect } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '../../../../../../store/automationflow'

function SendTextResponseNode({ id }: NodeProps) {
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
        <Select
          onValueChange={(value) => updateReplyOption(id, value, 'replyOption')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select reply option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'1'}>1</SelectItem>
            <SelectItem value={'2'}>2</SelectItem>
            <SelectItem value={'3'}>3</SelectItem>
            <SelectItem value={'4'}>4</SelectItem>
            <SelectItem value={'5'}>5</SelectItem>
            <SelectItem value={'6'}>6</SelectItem>
            <SelectItem value={'7'}>7</SelectItem>
            <SelectItem value={'8'}>8</SelectItem>
            <SelectItem value={'9'}>9</SelectItem>
            <SelectItem value={'0'}>0</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
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

