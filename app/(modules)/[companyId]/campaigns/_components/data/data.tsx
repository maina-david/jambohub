import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  GlobeIcon,
  HomeIcon,
  StopwatchIcon,
  TargetIcon,
} from "@radix-ui/react-icons"


export const statuses = [
  {
    value: "PLANNED",
    label: "Planned",
    icon: TargetIcon,
  },
  {
    value: "ACTIVE",
    label: "Active",
    icon: CircleIcon,
  },
  {
    value: "PAUSED",
    label: "Paused",
    icon: StopwatchIcon,
  },
  {
    value: "COMPLETED",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "CANCELED",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
]

export const audiences = [
  {
    label: "Internal",
    value: "INTERNAL",
    icon: HomeIcon,
  },
  {
    label: "Global",
    value: "GLOBAL",
    icon: GlobeIcon,
  },
]
