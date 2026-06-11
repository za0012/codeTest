import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

export function optionsResponse() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    headers: corsHeaders,
    status,
  });
}

export function createExtensionClient(accessToken?: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  });
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export async function getAuthedMember(request: Request) {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return {
      error: jsonResponse({ message: "로그인이 필요합니다." }, 401),
      member: null,
      supabase: null,
      user: null,
    };
  }

  const supabase = createExtensionClient(accessToken);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      error: jsonResponse({ message: "세션이 만료되었습니다." }, 401),
      member: null,
      supabase: null,
      user: null,
    };
  }

  const { data: member, error: memberError } = await supabase
    .from("study_members")
    .select("id, study_id, name, emoji, role")
    .eq("user_id", user.id)
    .single();

  if (memberError || !member) {
    return {
      error: jsonResponse(
        { message: "참여 중인 스터디를 찾지 못했습니다." },
        403,
      ),
      member: null,
      supabase: null,
      user: null,
    };
  }

  return {
    error: null,
    member,
    supabase,
    user,
  };
}
