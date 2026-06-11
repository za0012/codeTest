import { getAuthedMember, jsonResponse, optionsResponse } from "../../_shared";

export function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { error, member, user } = await getAuthedMember(request);

  if (error) {
    return error;
  }

  return jsonResponse({
    member,
    user: {
      email: user?.email,
      id: user?.id,
    },
  });
}
