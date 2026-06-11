const DEFAULT_API_BASE_URL = "http://localhost:3000";

async function getStoredAuth() {
  return chrome.storage.local.get([
    "apiBaseUrl",
    "accessToken",
    "refreshToken",
    "expiresAt",
    "member",
    "user",
  ]);
}

async function saveSession(session) {
  await chrome.storage.local.set({
    accessToken: session.accessToken,
    expiresAt: session.expiresAt,
    refreshToken: session.refreshToken,
  });
}

async function refreshSession(auth) {
  if (!auth.refreshToken) {
    throw new Error("다시 로그인이 필요합니다.");
  }

  const apiBaseUrl = auth.apiBaseUrl || DEFAULT_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/extension/auth/refresh`, {
    body: JSON.stringify({ refreshToken: auth.refreshToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "세션 갱신에 실패했습니다.");
  }

  await saveSession(result.session);
  return {
    ...auth,
    accessToken: result.session.accessToken,
    expiresAt: result.session.expiresAt,
    refreshToken: result.session.refreshToken,
  };
}

async function uploadProblem(payload, auth) {
  const apiBaseUrl = auth.apiBaseUrl || DEFAULT_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/extension/problems`, {
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const result = await response.json();

  if (response.status === 401) {
    const refreshedAuth = await refreshSession(auth);
    return uploadProblem(payload, refreshedAuth);
  }

  if (!response.ok) {
    throw new Error(result.message || "업로드에 실패했습니다.");
  }

  return result;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GET_AUTH_STATUS") {
    getStoredAuth()
      .then((auth) => {
        sendResponse({
          loggedIn: Boolean(auth.accessToken),
          member: auth.member,
          user: auth.user,
        });
      })
      .catch((error) => {
        sendResponse({ error: error.message, loggedIn: false });
      });

    return true;
  }

  if (message?.type === "UPLOAD_PROBLEM") {
    getStoredAuth()
      .then((auth) => {
        if (!auth.accessToken) {
          throw new Error("확장 프로그램에서 먼저 로그인해주세요.");
        }

        return uploadProblem(message.payload, auth);
      })
      .then((result) => {
        sendResponse({ ok: true, result });
      })
      .catch((error) => {
        sendResponse({ error: error.message, ok: false });
      });

    return true;
  }

  return false;
});
