'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SendTextNodeWait({ data }) {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value)
  }, [])

  return (
    <div className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <Label>Send Text</Label>
      <Textarea onChange={onChange} className="nodrag" />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
      </Select>
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  )
}

export default SendTextNodeWait
