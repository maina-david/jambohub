"use client"

import * as React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { HistoryIcon, Trash2Icon } from "lucide-react"
import { Icons } from "@/components/icons"

import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useRouter } from 'next-nprogress-bar'
import { Flow } from "@prisma/client"

interface FlowProps {
  flow: Flow
}

export function Actions({ flow }: FlowProps) {
  const queryClient = useQueryClient()
  const params = useParams()
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <HistoryIcon className="mr-2 h-4 w-4" />
            Revision History
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={flow.published}
            onSelect={() => setShowDeleteAlert(true)}
            className="cursor-pointer"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete Flow
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this flow?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                const deleted = await deleteAutomationflow(flow.companyId, flow.id)

                if (deleted) {
                  setIsDeleteLoading(false)
                  setShowDeleteAlert(false)
                  queryClient.invalidateQueries({ queryKey: ['companyFlows'] })
                  toast({
                    title: "Success",
                    description: "Flow deleted successfully",
                  })
                  router.replace(`/${params?.companyId}/flows`)
                }
              }}
              className="bg-red-600 focus:ring-red-600 dark:text-white"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

async function deleteAutomationflow(companyId: string, flowId: string) {
  const response = await fetch(`/api/companies/${companyId}/flows/${flowId}`, {
    method: "DELETE",
  })

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your flow was not deleted. Please try again.",
      variant: "destructive",
    })
  }

  return true
}
