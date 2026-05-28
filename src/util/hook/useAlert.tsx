// import { useState } from "react";
// import type { alertType } from "@/components/AlertCustom";

// export function useAlert() {
//   const [alertData, setAlertData] = useState<null | alertType>(null);

//   function setAlert({ title, content, variant, customClick }: alertType) {
//     setAlertData({ title, content, variant, customClick });
//   }

//   function closeAlert() {
//     setAlertData(null);
//   }

//   return { setAlert, closeAlert, alertData };
// }
"use client";

import { useAtom } from "jotai";
import { AlertCustom } from "@/components/AlertCustom";
import { alertAtom } from "@/lib/store/alertStore";

export function AlertManager() {
  const [alert, setAlert] = useAtom(alertAtom);

  if (!alert) return null;

  return <AlertCustom alert={alert} onClose={() => setAlert(null)} />;
}
