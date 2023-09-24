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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns'
import { Channel } from "@prisma/client"
import { Trash2Icon } from "lucide-react"

interface ChannelProps {
  data: Channel
}

export function ChannelCard({ data }: ChannelProps) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_120px] items-start gap-4 space-y-0">
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
              <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>
                <Pencil2Icon className="mr-2 h-4 w-4" />
                Link Account
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <Pencil2Icon className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil2Icon className="mr-2 h-4 w-4" /> Edit Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2Icon className="mr-2 h-4 w-4" /> Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            {data.identifier}
          </div>
          <div className="flex items-center">
            {data.integrated ? 'Linked' : 'Not Linked'}
          </div>
          <div>Updated {format(data.updatedAt, 'MMMM d, yyyy h:mm a')}</div>
        </div>
      </CardContent>
    </Card>
  )
}
