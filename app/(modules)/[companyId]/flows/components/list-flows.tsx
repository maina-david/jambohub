'use client'

import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Flow } from '@prisma/client'
import { FlowItem } from './flow-item'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { FlowCreateButton } from './flow-create-button'

export default function ListFlows() {
  const params = useParams()
  const companyId = params?.companyId

  const { isLoading, isSuccess, isError, data: flows, error } = useQuery({
    queryKey: ['companyFlows'],
    queryFn: () => fetchCompanyFlows(companyId as string),
  })

  if (isLoading) {
    return (
      <>
        <FlowItem.Skeleton />
        <FlowItem.Skeleton />
      </>
    )
  }

  if (isError) {
    if(error instanceof Error){
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {error.message}
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }else{
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Error</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            An error occurred while fetching automation flows
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )
    }
  }

  return (
    <div>
      {flows?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {flows.map((flow, index) => {
            return <FlowItem key={index} flow={flow} />
          })}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="flow" />
          <EmptyPlaceholder.Title>No automation flows created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any automation flows yet. Start creating flows.
          </EmptyPlaceholder.Description>
          <FlowCreateButton />
        </EmptyPlaceholder>
      )}
    </div>
  )
}

const fetchCompanyFlows = (companyId: string): Promise<Flow[]> =>
  axios.get(`/api/companies/${companyId}/flows`).then((response) => response.data)
