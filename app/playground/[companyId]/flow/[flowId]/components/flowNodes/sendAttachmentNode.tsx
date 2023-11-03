'use client'

import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '@/store/flowStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

function SendAttachmentNode({ id, data }: NodeProps) {
  const updateReplyOption = useStore((state) => state.updateReplyOption)

  return (
    <div className="flex w-64 rounded border border-stone-400 p-2 shadow-md"
      style={{ backgroundColor: data.color, borderRadius: 10 }}
    >
      <div className='grid w-full gap-2'>
        <Input placeholder='Enter reply option' value={data.replyOption} onChange={(evt) => updateReplyOption(id, evt.target.value, 'replyOption')} />
        <Select
          defaultValue={data.fileOption ? data.fileOption : undefined}
          onValueChange={(value) => updateReplyOption(id, value, 'fileOption')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select file to send" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'1'}>File 1</SelectItem>
            <SelectItem value={'2'}>File 2</SelectItem>
            <SelectItem value={'3'}>File 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Handle type="target" position={Position.Top} className="w-10 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-10 bg-teal-500" />
    </div>
  )
}

export default SendAttachmentNode
