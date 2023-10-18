"use client"

import * as React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const signInResult = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      })

      if (!signInResult?.ok) {
        if (signInResult?.error) {
          if (signInResult?.error == 'InvalidCredentials') {
            setError('email', {
              type: 'manual',
              message: 'Invalid credentials',
            })
            toast({
              title: "Authentication Failed",
              description: "Please check your credentials.",
              variant: "destructive",
            })
          } else if (signInResult?.error == 'AccountNotApproved') {
            toast({
              title: "Authentication Failed",
              description: "Your account is not approved yet.",
              variant: "destructive",
            })
          } else if (signInResult?.error == 'AccountNotActive') {
            toast({
              title: "Authentication Failed",
              description: "Your account is not active. Contact support for assistance.",
              variant: "destructive",
            })
          } else if (signInResult?.error == 'EmailNotVerified') {
            toast({
              title: "Authentication Failed",
              description: "You have not verified your email address.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Authentication Failed",
              description: "Unknown error occurred. Please try again.",
              variant: "destructive",
            })
          }
        }
        else {
          toast({
            title: "Authentication Failed",
            description: "Unknown error occurred. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        const redirectUri = searchParams?.get("from") ? searchParams?.get("from") as string : '/home'
        router.push(redirectUri)
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Authentication error:", error)
      toast({
        title: "Authentication Failed",
        description: "Error occurred during sign in request. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="***********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={
                isLoading
              }
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Credentials
          </Button>
        </div>
      </form>
    </div>
  )
}
