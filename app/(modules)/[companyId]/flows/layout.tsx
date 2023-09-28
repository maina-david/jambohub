import React from 'react'

export const metadata = {
  title: "ChatFlows",
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
