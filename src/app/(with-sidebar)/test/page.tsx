"use client";

// import { useState } from "react";
// import { AlertCustom } from "@/components/AlertCustom";
import { useSetAtom } from "jotai";
import Input from "@/components/ui/Input";
// import SelectDemo from "@/components/SelectCustom";
// import { PLATFORM_TAGS } from "@/constants/problem";
// import { DatePickerDemo } from "@/components/ui/DatePicker";
import Modal from "@/components/ui/Modal";
import { alertAtom } from "@/lib/store/alertStore";

// import { useAlert } from "@/util/hook/useAlert";

function page() {
  // const [isVisible, setIsVisible] = useState(false);

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
      <Modal title={"11"} subTitle={"22"}>
        <div
          className="flex flex-col gap-6 max-h-[55vh] overflow-y-auto pb-4 no-scrollbar"
          style={{
            msOverflowStyle: "none" /* IE and Edge */,
            scrollbarWidth: "none" /* Firefox */,
          }}
        >
          {/* 1. 이모지 변경 */}
          <div className="flex flex-col items-center justify-center gap-2 py-1">
            <button
              type="button"
              className="relative group w-24 h-24 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-full flex items-center justify-center text-5xl shadow-inner transition-colors"
            >
              🦊
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {/* <Pencil size={22} strokeWidth={2.5} className="text-white" /> */}
              </div>
            </button>
            <span className="text-xs font-bold text-gray-400 tracking-tight mt-1">
              이모지 변경
            </span>
          </div>

          {/* 2. 이름 */}
          {/* <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest ml-1">
              NAME
            </label>
            <input
              type="text"
              defaultValue="김민준"
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
            />
          </div>

           3. 한 줄 소개
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
              BIO
            </label>
            <input
              type="text"
              defaultValue="알고리즘으로 세상을 바꾸겠어!"
              placeholder="자신을 한 줄로 소개해보세요"
              className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
            />
          </div>

          4. 깃허브 주소 
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
              GITHUB URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
            />
          </div>

          5. 블로그 주소 
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
              BLOG URL
            </label>
            <input
              type="url"
              placeholder="https://velog.io/@username"
              className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
            />
          </div> */}
        </div>
      </Modal>
    </div>
  );
}

export default page;
