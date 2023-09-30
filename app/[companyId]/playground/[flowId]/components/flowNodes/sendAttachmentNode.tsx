'use client'

import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '../store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export type SendAttachmentData = {
  option: string
  file: string
}

function SendAttachmentNode({ id, data }: NodeProps<SendAttachmentData>) {
  const updateSendAttachmentOption = useStore((state) => state.updateSendAttachmentOption)

  return (
    <div className="rounded border border-stone-400 px-4 py-2 shadow">
      <div className='flex flex-col'>
        <Select>
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
        <Input type='file' id='attachment-file' className='mt-2' />
      </div>
      <Handle type="target" position={Position.Top} className="w-10 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-10 !bg-teal-500" />
    </div>
  )
}

export default SendAttachmentNode
