'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React, { useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SendTextWaitNode({ data }) {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value)
  }, [])

  return (
    <div className="rounded-md border-2 border-stone-400 px-4 py-2 shadow-md dark:text-white">
      <Label>Send Text</Label>
      <Input onChange={onChange} className="nodrag" />
      <div className='mt-2'>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      </div>
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  )
}

export default SendTextWaitNode
