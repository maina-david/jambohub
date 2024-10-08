'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserPlus2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { User } from '@prisma/client'
import { UserAvatar } from '@/components/user-avatar'

export default function TeamInvite() {
  const params = useParams()
  const companyId = params?.companyId
  const teamId = params?.teamId

  const [users, setUsers] = useState<User[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/companies/${companyId}/teams/${teamId}/fetch-app-users`, {
          params: { query: inputValue },
        })
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchData()
  }, [inputValue, companyId, teamId])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus2 className='mr-2 h-4 w-4' /> Invite Team Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite to Team</DialogTitle>
          <DialogDescription>
            Enter an email address or name to search for users
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            placeholder='Email address or name'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {users.length > 0 ? (
            <div className="grid gap-6">
              <ul>
                {users.map((user) => (
                  <li key={user.id} className='my-2 cursor-pointer rounded hover:bg-accent hover:text-accent-foreground'>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <UserAvatar
                          user={{ name: user.name || null, image: user.image || null }}
                          className="h-8 w-8"
                        />
                        <div>
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <small>{inputValue && 'Hmmm, it seems like that person is not a JamboHub user. You can send an invitation by entering an email address.'}</small>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
