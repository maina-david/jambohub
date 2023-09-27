'use client'

import React, { useState } from 'react'
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useTeamModal } from '@/hooks/use-team-modal'
import { useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(3).max(128)
})

export default function TeamModal() {
  const queryClient = useQueryClient()
  const params = useParams()
  const teamModal = useTeamModal()
  const [isLoading, setIsLoading] = useState(false)
  const team = teamModal.team
  const isUpdateMode = !!team

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  if (isUpdateMode) {
    form.setValue('name', team.name)
    form.setValue('description', team.description)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const companyId = params?.companyId

    try {
      if (isUpdateMode) {
        // Update existing team
        const teamId = team?.id
        const response = await axios.patch(`/api/companies/${companyId}/teams/${teamId}`, {
          ...values,
        })

        // Check if the update was successful
        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['companyTeams'] })
          toast({
            title: 'Success',
            description: 'Team updated successfully!',
          })
        } else {
          // Handle the case where the update was not successful
          toast({
            title: 'Update Failed',
            description: 'Failed to update the team. Please try again.',
            variant: 'destructive',
          })
        }
      } else {
        // Create a new team
        const response = await axios.post(`/api/companies/${companyId}/teams`, {
          ...values,
        })

        // Check if the creation was successful
        if (response.status === 201) {
          queryClient.invalidateQueries({ queryKey: ['companyTeams'] })
          toast({
            title: 'Success',
            description: 'Team created successfully!',
          })
        } else {
          // Handle the case where the creation was not successful
          toast({
            title: 'Creation Failed',
            description: 'Failed to create the team. Please try again.',
            variant: 'destructive',
          })
        }
      }
      teamModal.setTeam(null)
      teamModal.onClose()
    } catch (error) {
      // Handle specific errors
      if (error.response) {
        if (error.response.status === 422 && error.response.data) {
          // Handle validation errors
          const validationErrors = error.response.data
          // Update form field errors
          form.setError('name', {
            type: 'manual',
            message: validationErrors.name || '',
          })
          form.setError('description', {
            type: 'manual',
            message: validationErrors.description || '',
          })
        } else if (error.response.status === 402) {
          // Handle RequiresProPlanError
          toast({
            title: 'Requires Pro Plan',
            description: 'You need a pro plan for this operation.',
            variant: 'destructive',
          })
          teamModal.onClose()
        } else if (error.response.status === 403) {
          // Handle RequiresActivePlanError or MaximumPlanResourcesError
          toast({
            title: 'Permission Denied',
            description: 'You do not have permission for this operation.',
            variant: 'destructive',
          })
          teamModal.onClose()
        }
      } else {
        // Handle general errors
        console.error(error)
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onChange = (open: boolean) => {
    if (!open) {
      teamModal.onClose()
      teamModal.setTeam(null)
    }
  }

  return (
    <Dialog open={teamModal.isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? 'Edit Team' : 'New Team'}</DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? 'Edit the team details below:'
              : 'Create a new team by filling in the details below:'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter the team name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a unique name for the team.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Enter a brief team description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the team&apos;s purpose and responsibilities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}{' '}
                {isUpdateMode ? 'Update Team' : 'Create Team'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}

