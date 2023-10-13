import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser()
  if(user){
    return redirect('/home')
  }
  return <div className="min-h-screen">{children}</div>
}
