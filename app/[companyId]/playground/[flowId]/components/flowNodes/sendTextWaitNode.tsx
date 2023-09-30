'use client'

import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '../store'

export type SendTextWaitData = {
  value: string
}

function SendTextWaitNode({ id, data }: NodeProps<SendTextWaitData>) {
  const updateSendTextWaitValue = useStore((state) => state.updateSendTextWaitValue)

  return (
    <div className="flex rounded border border-stone-400 px-4 py-2 shadow">
      <Textarea
        value={data.value}
        onChange={(evt) => updateSendTextWaitValue(id, evt.target.value)}
        className="nodrag"
      />
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 !bg-yellow-500" />
      <Handle type="source" position={Position.Bottom} className="w-4 !bg-red-500" />
    </div>
  )
}

export default SendTextWaitNode
