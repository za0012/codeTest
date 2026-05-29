"use client";

import { useState } from "react";
import { AlertCustom } from "@/components/AlertCustom";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/lib/store/alertStore";
import Input from "@/components/ui/Input";
import SelectDemo from "@/components/SelectCustom";
import { PLATFORM_TAGS } from "@/constants/problem";
import { DatePickerDemo } from "@/components/ui/DatePicker";
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
      <Input label="Date" size="sm" />
      {/* 
      <div className="col-span-1">
        <select className="w-full bg-[#f9fafb] border-none rounded-xl px-4 py-3 text-[15px] font-medium text-[#4e5968] focus:bg-blue-50/30 focus:ring-2 focus:ring-[#3182f6] outline-none transition-all cursor-pointer">
          adsa
        </select>
        <SelectDemo
          size={"sm"}
          variant={"toss"}
          selectArray={Object.keys(PLATFORM_TAGS)}
          selectChange={setIsVisible}
          placeholder="플랫폼"
        />
      </div>
      <DatePickerDemo />
      <div>
        <label className="block text-[10px] font-bold text-[#8b95a1] mb-1.5 uppercase">
          Date
        </label>

        <input
          type="date"
          className="w-full bg-white border border-gray-100 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-[#3182f6] outline-none transition-all"
        />
      </div>

      <div className="col-span-1">
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#3182f6] mb-2 uppercase tracking-tight">
          Platform
        </label>

        <select className="w-full bg-[#f9fafb] border-none rounded-xl px-4 py-3 text-[15px] font-medium text-[#4e5968] focus:bg-blue-50/30 focus:ring-2 focus:ring-[#3182f6] outline-none transition-all cursor-pointer">
          <option>백준</option>

          <option>프로그래머스</option>

          <option>LeetCode</option>
        </select>
      </div> */}
    </div>
  );
}

export default page;
