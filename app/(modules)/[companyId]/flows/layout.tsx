import React from 'react'

export const metadata = {
  title: "Flows",
}

interface CompanyLayoutProps {
  children: React.ReactNode
}

export default function layout({ children }: CompanyLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}
