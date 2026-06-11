const DEFAULT_API_BASE_URL = "http://localhost:3000";

const elements = {
  apiBaseUrl: document.getElementById("api-base-url"),
  email: document.getElementById("email"),
  loggedIn: document.getElementById("logged-in"),
  loggedOut: document.getElementById("logged-out"),
  login: document.getElementById("login"),
  logout: document.getElementById("logout"),
  memberName: document.getElementById("member-name"),
  password: document.getElementById("password"),
  status: document.getElementById("status"),
  userEmail: document.getElementById("user-email"),
};

function setStatus(message, variant = "idle") {
  elements.status.textContent = message;
  elements.status.dataset.variant = variant;
}

async function loadState() {
  const state = await chrome.storage.local.get([
    "apiBaseUrl",
    "accessToken",
    "member",
    "user",
  ]);

  elements.apiBaseUrl.value = state.apiBaseUrl || DEFAULT_API_BASE_URL;

  if (!state.accessToken) {
    elements.loggedOut.hidden = false;
    elements.loggedIn.hidden = true;
    setStatus("로그인하면 프로그래머스 페이지에서 업로드할 수 있습니다.");
    return;
  }

  elements.loggedOut.hidden = true;
  elements.loggedIn.hidden = false;
  elements.userEmail.textContent = state.user?.email || "로그인됨";
  elements.memberName.textContent = state.member?.name
    ? `${state.member.name} 스터디 계정`
    : "스터디 계정";
  setStatus("로그인되어 있습니다.", "success");
}

async function login() {
  const apiBaseUrl = elements.apiBaseUrl.value.trim().replace(/\/$/, "");
  const email = elements.email.value.trim();
  const password = elements.password.value;

  if (!apiBaseUrl || !email || !password) {
    setStatus("서버 주소, 이메일, 비밀번호를 입력해주세요.", "error");
    return;
  }

  elements.login.disabled = true;
  setStatus("로그인 중입니다...");

  try {
    const response = await fetch(`${apiBaseUrl}/api/extension/auth/login`, {
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "로그인에 실패했습니다.");
    }

    await chrome.storage.local.set({
      accessToken: result.session.accessToken,
      apiBaseUrl,
      expiresAt: result.session.expiresAt,
      member: result.member,
      refreshToken: result.session.refreshToken,
      user: result.user,
    });

    elements.password.value = "";
    await loadState();
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    elements.login.disabled = false;
  }
}

async function logout() {
  await chrome.storage.local.remove([
    "accessToken",
    "expiresAt",
    "member",
    "refreshToken",
    "user",
  ]);
  await loadState();
}

elements.login.addEventListener("click", login);
elements.logout.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", loadState);
loadState();
