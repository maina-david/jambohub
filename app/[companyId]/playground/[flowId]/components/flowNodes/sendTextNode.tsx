'use client'

import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '../store'

export type SendTextData = {
  value: string
}

function SendTextNode({ id, data }: NodeProps<SendTextData>) {
  const updateSendTextValue = useStore((state) => state.updateSendTextValue)

  return (
    <div className="flex rounded border border-stone-400 px-4 py-2 shadow">
      <Textarea
        value={data.value}
        onChange={(evt) => updateSendTextValue(id, evt.target.value)}
        className="nodrag"
      />
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  )
}

export default SendTextNode
