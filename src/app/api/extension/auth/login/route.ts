import {
  createExtensionClient,
  jsonResponse,
  optionsResponse,
} from "../../_shared";

export function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonResponse(
        { message: "이메일과 비밀번호를 입력해주세요." },
        400,
      );
    }

    const supabase = createExtensionClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      return jsonResponse({ message: "로그인에 실패했습니다." }, 401);
    }

    const authedSupabase = createExtensionClient(data.session.access_token);
    const { data: member, error: memberError } = await authedSupabase
      .from("study_members")
      .select("id, study_id, name, emoji, role")
      .eq("user_id", data.user.id)
      .single();

    if (memberError || !member) {
      return jsonResponse(
        { message: "로그인은 되었지만 참여 중인 스터디가 없습니다." },
        403,
      );
    }

    return jsonResponse({
      member,
      session: {
        accessToken: data.session.access_token,
        expiresAt: data.session.expires_at,
        refreshToken: data.session.refresh_token,
      },
      user: {
        email: data.user.email,
        id: data.user.id,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        message:
          error instanceof Error
            ? error.message
            : "로그인 처리 중 오류가 났습니다.",
      },
      500,
    );
  }
}
