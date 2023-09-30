'use client'

import { Textarea } from '@/components/ui/textarea'
import React, { useCallback } from 'react'
import { Handle, Position } from 'reactflow'

function SendTextNode({ data }) {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value)
  }, [])

  return (
    <div className="rounded border border-stone-400 shadow">
      <Textarea onChange={onChange} className="nodrag" />
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  )
}

export default SendTextNode
