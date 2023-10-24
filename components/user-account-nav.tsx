"use client"

import * as React from "react"
import Link from "next/link"
import { User } from "next-auth"
import { signOut } from "next-auth/react"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { Icons } from "./icons"
import { Label } from "./ui/label"
import { useTheme } from "next-themes"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
  mdAndAbove: boolean
}

export function UserAccountNav({ user, mdAndAbove }: UserAccountNavProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { theme, setTheme } = useTheme()
  const [isLightTheme, setIsLightTheme] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (theme === 'light') {
      setIsLightTheme(true)
    } else {
      setIsLightTheme(false)
    }
  }, [theme])


  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="#">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!mdAndAbove && (
          <DropdownMenuItem>
            <div className="flex items-center space-x-2">
              <Switch id="theme"
                checked={isLightTheme}
                onCheckedChange={() => {
                  if(isLightTheme){
                    setTheme('dark')
                  }else{
                    setTheme('light')
                  }
                }}
              />
              <Label htmlFor="theme">
                <Icons.sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Icons.moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Label>
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled={isLoading}
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            setIsLoading(true)
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          {isLoading && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
          {" "}Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
