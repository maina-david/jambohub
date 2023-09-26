'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'
import axios from 'axios'
import { EmptyPlaceholder } from '@/components/empty-placeholder'

export default function ListTeams() {
  const params = useParams()
  const companyId = params?.companyId

  const { isLoading, isError, data: teams, error } = useQuery({
    queryKey: ['companyTeams'],
    queryFn: () => fetchTeams(companyId as string),
  })

  if (isError) {
    console.log("Error fetching teams:", error)
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
            An error occurred while fetching teams.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }
  }

  return (
    <div>ListTeams</div>
  )
}

async function fetchTeams(companyId: string) {
  return await axios.get(`/api/${companyId}/teams`)
}