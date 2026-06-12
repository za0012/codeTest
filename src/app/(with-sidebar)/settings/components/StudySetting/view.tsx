import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { ChevronRight, Copy, Earth, Sparkle, Trash2 } from "lucide-react";

import { getMyMemberInfo, getMyStudyInfo } from "@/lib/api/study";
import { alertAtom } from "@/lib/store/alertStore";
import { deleteStudyAtom } from "@/lib/store/deleteStudyStore";
import { modalAtom } from "@/lib/store/modalStore";
import type { Study, UserProfile } from "@/lib/types/study";
import { handleCopyClipBoard } from "./hook";
import { DeleteStudyConfirmModal } from "./modal/DeleteStudyConfirmModal";
import { EditStudyModal } from "./modal/EditStudyModal";
import { cancelDeleteStudy, scheduleDeleteStudy } from "./service";

function StudySetting() {
  const setAlert = useSetAtom(alertAtom);
  const setModal = useSetAtom(modalAtom);
  const setDeleteBanner = useSetAtom(deleteStudyAtom);
  const queryClient = useQueryClient();

  const { data: studyInfo, isLoading: studyInfoLoading } = useQuery<Study>({
    queryKey: ["studyInfo"],
    queryFn: getMyStudyInfo,
  });

  const { data: MyInfoInStudy, isLoading: myInfoLoading } =
    useQuery<UserProfile | null>({
      queryKey: ["getMyMemberInfo"],
      queryFn: getMyMemberInfo,
    });

  if (studyInfoLoading || myInfoLoading) {
    return <div></div>;
  }

  const deleteStudyFunction = async (studyId: number) => {
    const data = await scheduleDeleteStudy(studyId);
    queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
    if (!data?.delete_scheduled_at)
      return setAlert({
        title: "스터디 삭제",
        content: "다시 시도해주세요",
        variant: true,
      });
    setModal(null);
    setAlert({
      title: "스터디 삭제",
      content: `${new Date(data.delete_scheduled_at).toLocaleDateString("ko-KR")}에 스터디가 삭제될 예정이에요.`,
      variant: false,
    });
    // setDeleteBanner(data.delete_scheduled_at);
  };
  const deleteStudy = () => {
    if (!studyInfo?.id)
      return setAlert({
        title: "호출 실패",
        content: "스터디 정보가 존재하지 않습니다",
        variant: true,
      });
    else {
      setModal({
        title: "", // 타이틀은 무조건 비워두기!
        children: (
          <DeleteStudyConfirmModal
            onCancel={() => setModal(null)}
            onConfirm={() => deleteStudyFunction(studyInfo.id)}
          />
        ),
      });
    }
  };

  const cancelDeleteStudyFunction = async () => {
    if (!studyInfo?.id)
      return setAlert({
        title: "호출 실패",
        content: "스터디 정보가 존재하지 않습니다",
        variant: true,
      });
    else {
      await cancelDeleteStudy(studyInfo.id);
      queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
      setAlert({
        title: "삭제 취소",
        content: "스터디 삭제를 취소하였습니다.",
        variant: false,
      });
    }
  };

  const editStudyInfo = () => {
    if (!studyInfo?.id) {
      return setAlert({
        title: "호출 실패",
        content: "스터디 정보가 존재하지 않습니다",
        variant: true,
      });
    }
    setModal({
      title: "스터디 정보 수정",
      children: (
        <EditStudyModal
          studyId={studyInfo.id}
          studyName={studyInfo.name}
          studyDescription={studyInfo.description}
        />
      ),
    });
  };

  return (
    studyInfo &&
    MyInfoInStudy && (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-gray-400 font-bold tracking-wider ml-1 uppercase">
          스터디
        </p>
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
          <button
            type="button"
            onClick={editStudyInfo}
            className="flex flex-row items-center justify-between w-full p-5 text-left hover:bg-[#F9FAFB] active:bg-[#F2F4F6] transition-colors group"
          >
            <div className="flex flex-row items-center gap-4">
              <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
                <Earth strokeWidth={2} size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-gray-400 font-semibold">
                  스터디 이름
                </p>
                <p className="font-bold text-gray-800 text-[16px]">
                  {studyInfo?.name}
                </p>
              </div>
            </div>
            <ChevronRight
              strokeWidth={2.5}
              className="text-gray-300 group-hover:text-gray-400 transition-colors"
              size={18}
            />
          </button>

          {MyInfoInStudy.role === "스터디장" && (
            <>
              <div className="px-5">
                <div className="w-full h-px bg-gray-100" />
              </div>

              {/* 초대 코드 로우 */}
              <div className="flex flex-row items-center justify-between w-full p-5">
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-[#F2F4F6] p-3 rounded-2xl flex items-center justify-center text-gray-600">
                    <Sparkle strokeWidth={2} size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-400 font-semibold">
                      초대 코드
                    </p>
                    <p className="text-[16px] font-bold text-blue-600 tracking-wide">
                      {studyInfo?.invite_code}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyClipBoard(studyInfo.invite_code)}
                  className="flex flex-row items-center gap-1.5 bg-[#E8F3FF] hover:bg-[#DAEBFF] active:scale-95 transition-all px-3.5 py-2 rounded-xl text-blue-600"
                >
                  <Copy size={13} strokeWidth={2.5} />
                  <span className="text-xs font-bold">복사</span>
                </button>
              </div>

              <div className="px-5">
                <div className="w-full h-px bg-gray-100" />
              </div>

              <div className="flex flex-row items-center justify-between w-full p-5">
                <div className="flex flex-row items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                      studyInfo.delete_scheduled_at
                        ? "bg-gray-100 text-gray-500"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    <Trash2 strokeWidth={2} size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-400 font-semibold">삭제</p>
                    <p
                      className={`text-[16px] font-bold transition-colors duration-200 ${
                        studyInfo.delete_scheduled_at
                          ? "text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {studyInfo.delete_scheduled_at
                        ? "스터디 삭제 진행중"
                        : "스터디 삭제"}
                    </p>
                  </div>
                </div>

                {/* 버튼 스타일만 토스 디자인 시스템 스펙으로 커스텀 */}
                {studyInfo.delete_scheduled_at ? (
                  <button
                    type="button"
                    onClick={cancelDeleteStudyFunction}
                    className="flex flex-row items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition-all px-4 py-2 rounded-xl text-gray-600 min-w-19"
                  >
                    <span className="text-xs font-semibold tracking-tight">
                      취소하기
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={deleteStudy}
                    className="flex flex-row items-center justify-center bg-red-50 hover:bg-red-100 active:scale-[0.98] transition-all px-4 py-2 rounded-xl text-red-500 min-w-19"
                  >
                    <span className="text-xs font-semibold tracking-tight">
                      삭제하기
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}

export default StudySetting;
