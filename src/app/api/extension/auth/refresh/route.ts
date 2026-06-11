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
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return jsonResponse({ message: "refresh token이 필요합니다." }, 400);
    }

    const supabase = createExtensionClient();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return jsonResponse({ message: "세션 갱신에 실패했습니다." }, 401);
    }

    return jsonResponse({
      session: {
        accessToken: data.session.access_token,
        expiresAt: data.session.expires_at,
        refreshToken: data.session.refresh_token,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        message:
          error instanceof Error
            ? error.message
            : "세션 갱신 중 오류가 났습니다.",
      },
      500,
    );
  }
}
