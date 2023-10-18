"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Flow } from "@prisma/client"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Copy, Trash2Icon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

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

interface FlowOperationsProps {
  flow: Pick<Flow, "id" | "companyId" | "name">
}

export function FlowOperations({ flow }: FlowOperationsProps) {
  const queryClient = useQueryClient()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

  const deleteFlowAction = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            View Execution Logs
          </DropdownMenuItem>
          <DropdownMenuItem>
            Open Flow Configuration
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" /> Duplicate Flow
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete Flow
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
              onClick={deleteFlowAction}
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
