"use client"

import { useEffect } from "react"

import { useCompanyModal } from "@/hooks/use-company-modal"

const SetupPage = () => {
  const onOpen = useCompanyModal((state) => state.onOpen)
  const isOpen = useCompanyModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return null
}

export default SetupPage
