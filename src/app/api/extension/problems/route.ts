import { getAuthedMember, jsonResponse, optionsResponse } from "../_shared";

type ExtensionProblemPayload = {
  difficulty?: string;
  memo?: string;
  solution?: string;
  tags?: string[];
  timeSpentMinutes?: number;
  title?: string;
  url?: string;
};

const PROGRAMMERS = "프로그래머스";

function todayInKorea() {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(new Date());
}

function normalizeUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url;
  }
}

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  const { error, member, supabase } = await getAuthedMember(request);

  if (error) {
    return error;
  }

  if (!member || !supabase) {
    return jsonResponse({ message: "인증 정보를 확인하지 못했습니다." }, 401);
  }

  try {
    const payload = (await request.json()) as ExtensionProblemPayload;
    const title = payload.title?.trim();
    const url = payload.url ? normalizeUrl(payload.url) : "";

    if (!title || !url) {
      return jsonResponse({ message: "문제 제목과 URL은 필수입니다." }, 400);
    }

    const { data: existingProblem } = await supabase
      .from("problems")
      .select("id")
      .eq("member_id", member.id)
      .eq("url", url)
      .maybeSingle();

    if (existingProblem) {
      return jsonResponse({
        duplicated: true,
        message: "이미 업로드한 문제입니다.",
        problem: existingProblem,
      });
    }

    const { data: problem, error: insertError } = await supabase
      .from("problems")
      .insert({
        date: todayInKorea(),
        difficulty: payload.difficulty || "Lv.0",
        member_id: member.id,
        memo: payload.memo ?? "",
        platform: PROGRAMMERS,
        solution: payload.solution ?? "",
        study_id: member.study_id,
        tags: normalizeTags(payload.tags),
        time_spent: Number(payload.timeSpentMinutes ?? 0),
        title,
        url,
      })
      .select()
      .single();

    if (insertError) {
      return jsonResponse({ message: insertError.message }, 500);
    }

    return jsonResponse({
      duplicated: false,
      problem,
    });
  } catch (problemError) {
    return jsonResponse(
      {
        message:
          problemError instanceof Error
            ? problemError.message
            : "문제 업로드 중 오류가 났습니다.",
      },
      500,
    );
  }
}
