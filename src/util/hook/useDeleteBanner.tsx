"use client";

import { useAtom } from "jotai";
import { DeleteScheduledBanner } from "@/components/DeleteScheduledBanner";
import { deleteStudyAtom } from "@/lib/store/deleteStudyStore";

export function DeleteBannerManager() {
  const [deleteBanner, setDeleteBanner] = useAtom(deleteStudyAtom);

  if (!deleteBanner) return null;

  return <DeleteScheduledBanner deleteStudyAt={deleteBanner} />;
}
