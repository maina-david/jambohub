"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Store as Company } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCompanyModal } from "@/hooks/use-company-modal"
import { useParams, useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface CompanySwitcherProps extends PopoverTriggerProps {
  companies?: Record<string, any>[] | null
}

export default function CompanySwitcher({ className, companies = [] }: CompanySwitcherProps) {
  const companyModal = useCompanyModal()
  const [open, setOpen] = React.useState(false)
  const params = useParams()
  const router = useRouter()

  if (!companies) {
    return null
  }
  const formattedItems = companies.map((company) => ({
    label: company.name,
    value: company.id
  }))

  const currentCompany = formattedItems.find((company) => company.value === params?.companyId)

  const onCompanySelect = (company: { value: string, label: string }) => {
    setOpen(false)
    router.push(`/${company.value}/dashboard`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a company"
          className={cn("w-[200px] justify-between", className)}
        >
          <Company className="mr-2 h-4 w-4" />
          <span className="truncate">{currentCompany?.label}</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search company..." />
            <CommandEmpty>No company found.</CommandEmpty>
            <CommandGroup heading="Companies">
              {formattedItems.map((company) => (
                <CommandItem
                  key={company.value}
                  onSelect={() => onCompanySelect(company)}
                  className="text-sm"
                >
                  <Company className="mr-2 h-4 w-4" />
                  {company.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentCompany?.value === company.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  companyModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Company
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
