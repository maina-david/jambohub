
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ListTeamMembers from "../../_component/list-team-members"


export default function TeamMembers() {
  return (
    <div className="ml-2">
      <div className="mb-6 flex flex-col">
        <CardTitle>Team Members</CardTitle>
        <CardDescription className="mt-2">
          Team members can view and collaborate on all Team visible channels, chatflows, campaigns and chats
        </CardDescription>
      </div>
      <CardContent className="grid gap-6">
        <ListTeamMembers />
      </CardContent>
    </div>
  )
}
