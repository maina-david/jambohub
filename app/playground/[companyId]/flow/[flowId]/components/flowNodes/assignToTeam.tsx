'use client'

import React, { useEffect, useState } from 'react'
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
import { fetchTeams } from '@/actions/team-actions'
import { Team } from '@prisma/client'
import { useParams } from 'next/navigation'

export type AssignToTeamData = {
  replyOption: string
  teamOption: string
}

function AssignToTeamNode({ id, data }: NodeProps<AssignToTeamData>) {
  const updateReplyOption = useStore((state) => state.updateReplyOption)
  const [teams, setTeams] = useState<Team[]>([])
  const params = useParams()

  useEffect(() => {
    if (params?.companyId) {
      fetchTeams(params.companyId as string).then((teams) => {
        setTeams(teams)
      })
    }
  }, [params?.companyId])

  return (
    <div className="flex w-64 rounded border border-stone-400 p-2 shadow-md">
      <div className="grid w-full gap-2">
        <Input placeholder='Enter reply option' value={data.replyOption} onChange={(evt) => updateReplyOption(id, evt.target.value, 'replyOption')} />
        <Select
          defaultValue={data.teamOption ? data.teamOption : undefined}
          onValueChange={(value) => updateReplyOption(id, value, 'teamOption')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Team to Assign" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Handle type="target" position={Position.Top} className="w-10 bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-10 bg-teal-500" />
    </div>
  )
}

export default AssignToTeamNode

