"use client";

import { useEffect, useState } from "react";

import { CompanyModal } from "@/components/modals/company-modal";

export const CompanyModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CompanyModal />
    </>
  );
}
