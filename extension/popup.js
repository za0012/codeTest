const { DEFAULT_API_BASE_URL } = CodeTestUploader.CONFIG;

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

function showLoggedOut(apiBaseUrl) {
  elements.apiBaseUrl.value = apiBaseUrl || DEFAULT_API_BASE_URL;
  elements.loggedOut.hidden = false;
  elements.loggedIn.hidden = true;
  setStatus("로그인하면 프로그래머스 페이지에서 업로드할 수 있습니다.");
}

function showLoggedIn(state) {
  elements.loggedOut.hidden = true;
  elements.loggedIn.hidden = false;
  elements.userEmail.textContent = state.user?.email || "로그인됨";
  elements.memberName.textContent = state.member?.name
    ? `${state.member.name} 스터디 계정`
    : "스터디 계정";
  setStatus("로그인되어 있습니다.", "success");
}

async function loadState() {
  const state = await CodeTestUploader.storage.getAuth();

  if (!state.accessToken) {
    showLoggedOut(state.apiBaseUrl);
    return;
  }

  showLoggedIn(state);
}

async function login() {
  const apiBaseUrl = elements.apiBaseUrl.value.trim();
  const email = elements.email.value.trim();
  const password = elements.password.value;

  if (!apiBaseUrl || !email || !password) {
    setStatus("서버 주소, 이메일, 비밀번호를 입력해주세요.", "error");
    return;
  }

  elements.login.disabled = true;
  setStatus("로그인 중입니다...");

  try {
    await CodeTestUploader.api.login({ apiBaseUrl, email, password });
    elements.password.value = "";
    await loadState();
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    elements.login.disabled = false;
  }
}

async function logout() {
  await CodeTestUploader.storage.clearAuth();
  await loadState();
}

elements.login.addEventListener("click", login);
elements.logout.addEventListener("click", logout);
loadState();
