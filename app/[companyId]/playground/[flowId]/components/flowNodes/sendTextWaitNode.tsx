'use client'

import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '../store'

export type SendTextWaitData = {
  value: string
}

function SendTextWaitNode({ id, data }: NodeProps<SendTextWaitData>) {
  const updateSendTextValue = useStore((state) => state.updateSendTextValue)

  return (
    <div className="flex w-64 rounded border border-stone-400 p-2 shadow-md">
      <div className="grid w-full gap-1.5">
        <Textarea
          value={data.value}
          onChange={(evt) => updateSendTextValue(id, evt.target.value)}
          className="nodrag resize-none"
        />
      </div>
      <Handle type="target" position={Position.Top} className="w-10 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-10 bg-teal-500" />
    </div>
  )
}

export default SendTextWaitNode
