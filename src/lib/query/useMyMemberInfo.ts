import { useQuery } from "@tanstack/react-query";
import { getMyMemberInfo } from "@/lib/api/study";
import type { UserProfile } from "@/lib/types/study";

// 로그인한 사용자의 study_members 행. 화면 여러 곳에서 필요하지만 데이터는 하나다.
//
// TanStack Query의 캐시는 queryKey로만 조회한다. queryFn이 같은 함수인지는 보지 않으므로
// 호출부마다 키 이름을 다르게 쓰면 같은 응답이 별개 엔트리로 저장되고 요청도 각각 나간다.
// (통합 전: /settings 3회, /mypage 2회)
//
// 키를 이 파일에서만 정의하고 훅으로 감싸 공유한다. 컴포넌트 위치는 그대로 두고,
// 무효화도 MY_MEMBER_INFO_KEY 하나만 걸면 모든 구독자가 함께 갱신된다.
export const MY_MEMBER_INFO_KEY = ["myMemberInfo"] as const;

export function useMyMemberInfo() {
  return useQuery<UserProfile | null>({
    queryKey: MY_MEMBER_INFO_KEY,
    queryFn: getMyMemberInfo,
  });
}
