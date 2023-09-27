'use client'

import React from 'react'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTeamModal } from '@/hooks/use-team-modal'
import { useParams } from 'next/navigation'
import TeamHeaderSkeleton from './team-header-skeleton'
import { Icons } from '@/components/icons'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PencilIcon, UserPlus2 } from 'lucide-react'
import { Team } from '@prisma/client'

export default function TeamHeader() {
  const params = useParams()
  const teamModal = useTeamModal()
  const { isLoading, isSuccess, isError, data: team, error } = useQuery({
    queryKey: ['teamDetails'],
    queryFn: () => getTeamDetails(params?.companyId as string, params?.teamId as string),
  })

  if (isLoading) {
    return <TeamHeaderSkeleton />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <Icons.warning className='h-4 w-4' />
          <Icons.warning className='h-4 w-4' />
        </div>
        <Icons.warning className='h-4 w-4' />
      </div>
    )
  }

  if (isSuccess && team) {
    return (
      <>
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0">{team.name}</h2>
            <Button onClick={teamModal.onOpen} variant={'ghost'} size={'icon'}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            {team && <p className="text-muted-foreground">{team.description}</p>}
          </div>
          <Button>
            <UserPlus2 className='mr-2 h-4 w-4' /> Invite Team Members
          </Button>
        </div>
        <Separator />
      </>
    )
  }
}

const getTeamDetails = (companyId: string, teamId: string): Promise<Team | undefined> =>
  axios.get(`/api/companies/${companyId}/teams/${teamId}`).then((response) => response.data)

