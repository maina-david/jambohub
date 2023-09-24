import {
  ChevronDownIcon,
  CircleIcon,
  Pencil2Icon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Trash2Icon, XIcon } from "lucide-react"
import { format } from 'date-fns'
interface ChannelProps {
  data: {
    name: string,
    description?: string | null,
    type: string,
    identifier: string | null,
    status: boolean,
    integrated: boolean,
    updatedAt: Date
  }
}

export function ChannelCard({ data }: ChannelProps) {
  return (
    <Card className="flex">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>
            {data.description}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="secondary" className="px-3 shadow-none">
            <StarIcon className="mr-2 h-4 w-4" />
            {data.type.toLowerCase()}
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
                <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil2Icon className="mr-2 h-4 w-4" /> Edit Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusIcon className="mr-2 h-4 w-4" /> Link Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2Icon className="mr-2 h-4 w-4" /> Delete Channel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {data.integrated ? 'Linked' : 'Not Linked'}
          </div>
          <div>Updated {format(data.updatedAt, 'MMMM dd, yyyy hh:mm a')}</div>
        </div>
      </CardContent>
    </Card >
  )
}
