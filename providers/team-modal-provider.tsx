"use client";

import { useEffect, useState } from "react";

import TeamModal from "@/components/modals/team-modal";

export const TeamModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <TeamModal />
    </>
  );
}
