(() => {
  const namespace = globalThis.CodeTestUploader;
  const { API_PATHS, DEFAULT_API_BASE_URL } = namespace.CONFIG;

  function getApiBaseUrl(authOrUrl) {
    if (typeof authOrUrl === "string") {
      return authOrUrl.replace(/\/$/, "") || DEFAULT_API_BASE_URL;
    }

    return (authOrUrl?.apiBaseUrl || DEFAULT_API_BASE_URL).replace(/\/$/, "");
  }

  async function parseJsonResponse(response) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async function postJson(url, body, headers = {}) {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      method: "POST",
    });

    return {
      body: await parseJsonResponse(response),
      response,
    };
  }

  async function login({ apiBaseUrl, email, password }) {
    const baseUrl = getApiBaseUrl(apiBaseUrl);
    const { body, response } = await postJson(`${baseUrl}${API_PATHS.LOGIN}`, {
      email,
      password,
    });

    if (!response.ok) {
      throw new Error(body.message || "로그인에 실패했습니다.");
    }

    await namespace.storage.saveLoginState({
      apiBaseUrl: baseUrl,
      member: body.member,
      session: body.session,
      user: body.user,
    });

    return body;
  }

  async function refreshSession(auth) {
    if (!auth.refreshToken) {
      throw new Error("다시 로그인이 필요합니다.");
    }

    const baseUrl = getApiBaseUrl(auth);
    const { body, response } = await postJson(
      `${baseUrl}${API_PATHS.REFRESH}`,
      {
        refreshToken: auth.refreshToken,
      },
    );

    if (!response.ok) {
      throw new Error(body.message || "세션 갱신에 실패했습니다.");
    }

    await namespace.storage.saveSession(body.session);

    return {
      ...auth,
      accessToken: body.session.accessToken,
      expiresAt: body.session.expiresAt,
      refreshToken: body.session.refreshToken,
    };
  }

  async function uploadProblem(payload, auth) {
    const baseUrl = getApiBaseUrl(auth);
    const { body, response } = await postJson(
      `${baseUrl}${API_PATHS.PROBLEMS}`,
      payload,
      {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    );

    if (response.status === 401) {
      const refreshedAuth = await refreshSession(auth);
      return uploadProblem(payload, refreshedAuth);
    }

    if (!response.ok) {
      throw new Error(body.message || "업로드에 실패했습니다.");
    }

    return body;
  }

  namespace.api = {
    login,
    uploadProblem,
  };
})();
