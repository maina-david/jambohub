'use client'

import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '../store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type SendAttachmentData = {
  replyOption: string
  fileOption: string
}

function SendAttachmentNode({ id, data }: NodeProps<SendAttachmentData>) {
  const updateReplyOption = useStore((state) => state.updateReplyOption)

  return (
    <div className="flex w-64 rounded border border-stone-400 p-2 shadow-md">
      <div className='flex flex-col'>
        <Select onValueChange={(value) => updateReplyOption(id, value, 'replyOption')} defaultValue={data.replyOption}>
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
        <Select onValueChange={(value) => updateReplyOption(id, value, 'fileOption')} defaultValue={data.fileOption}>
          <SelectTrigger>
            <SelectValue placeholder="Select file" />
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
