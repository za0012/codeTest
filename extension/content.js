const PROGRAMMERS_LEVELS = ["Lv.0", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"];
let panel;
let observer;
let autoOpened = false;

function normalizeText(value) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function getProblemTitle() {
  const heading =
    document.querySelector("h2") ||
    document.querySelector("h1") ||
    document.querySelector("[class*='title']");

  const headingText = normalizeText(heading?.textContent);
  if (headingText) {
    return headingText;
  }

  return normalizeText(document.title.replace(/코딩테스트 연습\s*-\s*/, ""));
}

function getProblemTags() {
  const candidates = Array.from(
    document.querySelectorAll(
      "nav a, ol a, .breadcrumb a, [class*='breadcrumb'] a",
    ),
  )
    .map((element) => normalizeText(element.textContent))
    .filter(Boolean)
    .filter((tag) => !["코딩테스트 연습", "프로그래머스"].includes(tag));

  return Array.from(new Set(candidates)).slice(0, 5);
}

function getDifficultyFromPage() {
  const text = normalizeText(document.body.innerText);
  const match = text.match(/Lv\.?\s*([0-5])/i);
  return match ? `Lv.${match[1]}` : "Lv.0";
}

function getProblemUrl() {
  return `${location.origin}${location.pathname}`;
}

function readCodeFromDom() {
  const selectors = [
    "textarea",
    ".monaco-editor textarea",
    ".CodeMirror-code",
    ".view-lines",
    "pre code",
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);

    if (!element) {
      continue;
    }

    if ("value" in element && element.value) {
      return element.value;
    }

    const text = normalizeText(element.textContent);
    if (text.length > 20) {
      return element.textContent;
    }
  }

  return "";
}

function readCodeFromPage() {
  return new Promise((resolve) => {
    let settled = false;

    function finish(code) {
      if (settled) {
        return;
      }

      settled = true;
      resolve(code || readCodeFromDom());
    }

    window.addEventListener(
      "codetest-study-uploader-code",
      (event) => finish(event.detail?.code),
      { once: true },
    );

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("page-bridge.js");
    script.onload = () => script.remove();
    document.documentElement.appendChild(script);

    window.setTimeout(() => finish(""), 600);
  });
}

function looksAccepted() {
  const text = normalizeText(document.body.innerText);

  return (
    /정답입니다|모든 테스트.*통과|채점 결과.*통과|합계:\s*100\.0/.test(text) &&
    !/실패|오답|컴파일 에러|런타임 에러/.test(text)
  );
}

function createFloatingButton() {
  if (document.getElementById("codetest-study-uploader-open")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "codetest-study-uploader-open";
  button.type = "button";
  button.textContent = "스터디 업로드";
  button.addEventListener("click", () => openPanel(false));
  document.body.appendChild(button);
}

function createPanel() {
  const wrapper = document.createElement("div");
  wrapper.id = "codetest-study-uploader-panel";
  wrapper.innerHTML = `
    <div class="ctsu-header">
      <div>
        <p class="ctsu-eyebrow">Programmers</p>
        <strong class="ctsu-title"></strong>
      </div>
      <button class="ctsu-close" type="button" aria-label="닫기">×</button>
    </div>
    <label class="ctsu-field">
      <span>난이도</span>
      <select class="ctsu-difficulty">
        ${PROGRAMMERS_LEVELS.map((level) => `<option value="${level}">${level}</option>`).join("")}
      </select>
    </label>
    <label class="ctsu-field">
      <span>메모</span>
      <textarea class="ctsu-memo" rows="5" placeholder="풀이하면서 기억할 점만 적어주세요."></textarea>
    </label>
    <div class="ctsu-status" role="status"></div>
    <button class="ctsu-submit" type="button">스터디에 올리기</button>
  `;

  wrapper.querySelector(".ctsu-close").addEventListener("click", closePanel);
  wrapper
    .querySelector(".ctsu-submit")
    .addEventListener("click", submitProblem);
  document.body.appendChild(wrapper);

  return wrapper;
}

async function openPanel(fromAccepted) {
  if (!panel) {
    panel = createPanel();
  }

  const auth = await chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" });
  panel.dataset.open = "true";
  panel.querySelector(".ctsu-title").textContent = getProblemTitle();
  panel.querySelector(".ctsu-difficulty").value = getDifficultyFromPage();

  const status = panel.querySelector(".ctsu-status");
  if (!auth?.loggedIn) {
    status.textContent = "확장 프로그램 아이콘을 눌러 먼저 로그인해주세요.";
    status.dataset.variant = "error";
    return;
  }

  status.textContent = fromAccepted
    ? "통과가 감지됐어요. 메모만 적고 올리면 됩니다."
    : "메모를 적고 업로드할 수 있습니다.";
  status.dataset.variant = "idle";
}

function closePanel() {
  if (panel) {
    panel.dataset.open = "false";
  }
}

async function submitProblem() {
  const submitButton = panel.querySelector(".ctsu-submit");
  const status = panel.querySelector(".ctsu-status");

  submitButton.disabled = true;
  status.textContent = "코드와 문제 정보를 읽는 중입니다...";
  status.dataset.variant = "idle";

  const code = await readCodeFromPage();
  const payload = {
    difficulty: panel.querySelector(".ctsu-difficulty").value,
    memo: panel.querySelector(".ctsu-memo").value,
    solution: code,
    tags: getProblemTags(),
    title: getProblemTitle(),
    url: getProblemUrl(),
  };

  chrome.runtime.sendMessage(
    { payload, type: "UPLOAD_PROBLEM" },
    (response) => {
      submitButton.disabled = false;

      if (!response?.ok) {
        status.textContent = response?.error || "업로드에 실패했습니다.";
        status.dataset.variant = "error";
        return;
      }

      status.textContent = response.result?.duplicated
        ? "이미 올라간 문제입니다."
        : "스터디에 업로드했습니다.";
      status.dataset.variant = "success";
    },
  );
}

function startAcceptedObserver() {
  observer = new MutationObserver(() => {
    if (!autoOpened && looksAccepted()) {
      autoOpened = true;
      openPanel(true);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.setTimeout(() => {
    if (!autoOpened && looksAccepted()) {
      autoOpened = true;
      openPanel(true);
    }
  }, 1000);
}

if (location.hostname === "school.programmers.co.kr") {
  createFloatingButton();
  startAcceptedObserver();
}

window.addEventListener("beforeunload", () => observer?.disconnect());
