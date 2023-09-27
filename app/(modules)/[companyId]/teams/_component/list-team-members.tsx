'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import axios from 'axios'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import TeamMemberSkeleton from './team-member-skeleton'
import { User } from '@prisma/client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { UserAvatar } from '@/components/user-avatar'

export default function ListTeamMembers() {
  const params = useParams()
  const companyId = params?.companyId
  const teamId = params?.teamId

  const { isLoading, isError, data: teamMembers, error } = useQuery({
    queryKey: ['TeamMembers'],
    queryFn: () => fetchTeamMembers(companyId as string, teamId as string),
  })

  if (isLoading) {
    return (
      <>
        <TeamMemberSkeleton />
        <TeamMemberSkeleton />
      </>
    )
  }
  if (isError) {
    console.log("Error fetching team members:", error)
    if (error instanceof Error) {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {error.message}
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    } else {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            An error occurred while fetching team members.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }
  }

  return (
    <>
      {teamMembers.map((member, index) => {
        return (
          <div key={index}>
            <Separator className='mb-2' />
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <UserAvatar
                  user={{ name: member.name || null, image: member.image || null }}
                  className="h-8 w-8"
                />
                <div>
                  <p className="text-sm font-medium leading-none">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Owner{" "}
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Select new role..." />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Viewer</p>
                          <p className="text-sm text-muted-foreground">
                            Can view and collaborate.
                          </p>
                        </CommandItem>
                        <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Owner</p>
                          <p className="text-sm text-muted-foreground">
                            Admin-level access to all resources.
                          </p>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Separator className='mt-2' />
          </div>
        )
      })}
    </>
  )
}

const fetchTeamMembers = (companyId: string, teamId: string): Promise<User[]> =>
  axios.get(`/api/companies/${companyId}/teams/${teamId}/members`).then((response) => response.data)

