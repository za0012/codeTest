"use client";

import { useState } from "react";
import { AlertCustom } from "@/components/AlertCustom";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/lib/store/alertStore";
// import { useAlert } from "@/util/hook/useAlert";

function page() {
  const [isVisible, setIsVisible] = useState(false);

  // const { alertData, setAlert, closeAlert } = useAlert();
  const setAlert = useSetAtom(alertAtom);
  const handleTestAlert = () => {
    setAlert({
      title: "회원가입 오류",
      content: "모든 항목을 입력해주세요",
      variant: true,
    });
  };

  return (
    <div>
      <button type="button" onClick={handleTestAlert}>
        alert 테스트
      </button>
      {/* <AlertCustom alert={alertData} onClose={closeAlert} /> */}
    </div>
  );
}

export default page;
