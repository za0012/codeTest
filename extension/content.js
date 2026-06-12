const PROGRAMMERS_LEVELS = ["Lv.0", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"];
const DEFAULT_CORNER = "bottom-right";
const DIFFICULTY_CACHE_PREFIX = "programmersDifficulty:";
const FLOATING_CORNERS = new Set([
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
]);

let panel;
let observer;
let autoOpened = false;
let acceptedDetected = false;
let currentCorner = DEFAULT_CORNER;

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

function parseDifficultyFromText(text) {
  const normalizedText = normalizeText(text);
  const match =
    normalizedText.match(/Lv\.?\s*([0-5])/i) ||
    normalizedText.match(/level["'\s:=]+([0-5])/i) ||
    normalizedText.match(/difficulty["'\s:=]+(?:Lv\.?)?\s*([0-5])/i);

  return match ? `Lv.${match[1]}` : "Lv.0";
}

function getLessonId() {
  return location.pathname.match(/\/lessons\/(\d+)/)?.[1] ?? "";
}

function findDifficultyNearLessonLink(html, lessonId) {
  if (!lessonId) {
    return "Lv.0";
  }

  const lessonIndex = html.indexOf(`/lessons/${lessonId}`);
  if (lessonIndex === -1) {
    return "Lv.0";
  }

  const nearbyText = html.slice(
    Math.max(0, lessonIndex - 3000),
    Math.min(html.length, lessonIndex + 3000),
  );

  return parseDifficultyFromText(nearbyText);
}

function getDifficultyFromPage() {
  const candidates = [
    document.body.innerText,
    document.documentElement.innerHTML,
    ...Array.from(document.querySelectorAll("meta, script"))
      .map((element) => element.getAttribute("content") || element.textContent)
      .filter(Boolean),
  ];

  for (const candidate of candidates) {
    const difficulty = parseDifficultyFromText(candidate);
    if (difficulty !== "Lv.0") {
      return difficulty;
    }
  }

  return "Lv.0";
}

async function getCachedDifficulty(lessonId) {
  if (!lessonId) {
    return "";
  }

  const cacheKey = `${DIFFICULTY_CACHE_PREFIX}${lessonId}`;
  const cached = await chrome.storage.local.get(cacheKey);
  return cached[cacheKey] || "";
}

function setCachedDifficulty(lessonId, difficulty) {
  if (!lessonId || !difficulty || difficulty === "Lv.0") {
    return;
  }

  chrome.storage.local.set({
    [`${DIFFICULTY_CACHE_PREFIX}${lessonId}`]: difficulty,
  });
}

async function fetchDifficultyFromChallengeSearch(title, lessonId) {
  if (!title || !lessonId) {
    return "Lv.0";
  }

  const encodedTitle = encodeURIComponent(title);
  const searchPaths = [
    `/learn/challenges?order=recent&search=${encodedTitle}`,
    `/learn/challenges?order=acceptance_desc&search=${encodedTitle}`,
    `/learn/challenges?order=level_asc&search=${encodedTitle}`,
  ];

  for (const path of searchPaths) {
    const response = await fetch(path, { credentials: "include" });
    const html = await response.text();
    const difficulty = findDifficultyNearLessonLink(html, lessonId);

    if (difficulty !== "Lv.0") {
      return difficulty;
    }
  }

  for (const level of [0, 1, 2, 3, 4, 5]) {
    const response = await fetch(
      `/learn/challenges?order=recent&levels=${level}&search=${encodedTitle}`,
      { credentials: "include" },
    );
    const html = await response.text();

    if (html.includes(`/lessons/${lessonId}`)) {
      return `Lv.${level}`;
    }
  }

  return "Lv.0";
}

async function detectDifficulty() {
  const lessonId = getLessonId();
  const pageDifficulty = getDifficultyFromPage();

  if (pageDifficulty !== "Lv.0") {
    setCachedDifficulty(lessonId, pageDifficulty);
    return pageDifficulty;
  }

  const cachedDifficulty = await getCachedDifficulty(lessonId);
  if (cachedDifficulty) {
    return cachedDifficulty;
  }

  try {
    const fetchedDifficulty = await fetchDifficultyFromChallengeSearch(
      getProblemTitle(),
      lessonId,
    );
    setCachedDifficulty(lessonId, fetchedDifficulty);
    return fetchedDifficulty;
  } catch {
    return "Lv.0";
  }
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

function updateAcceptedState() {
  if (looksAccepted()) {
    acceptedDetected = true;
  }

  return acceptedDetected;
}

function isFloatingCorner(value) {
  return FLOATING_CORNERS.has(value);
}

function nearestCorner(clientX, clientY) {
  const vertical = clientY < window.innerHeight / 2 ? "top" : "bottom";
  const horizontal = clientX < window.innerWidth / 2 ? "left" : "right";
  return `${vertical}-${horizontal}`;
}

function applyFloatingCorner(corner) {
  currentCorner = isFloatingCorner(corner) ? corner : DEFAULT_CORNER;

  const button = document.getElementById("codetest-study-uploader-open");
  if (button) {
    button.dataset.corner = currentCorner;
    button.style.left = "";
    button.style.right = "";
    button.style.top = "";
    button.style.bottom = "";
  }

  if (panel) {
    panel.dataset.corner = currentCorner;
  }
}

async function restoreFloatingCorner() {
  const { uploaderCorner } = await chrome.storage.local.get("uploaderCorner");
  applyFloatingCorner(uploaderCorner);
}

function saveFloatingCorner(corner) {
  chrome.storage.local.set({ uploaderCorner: corner });
}

function enableFloatingButtonDrag(button) {
  let startX = 0;
  let startY = 0;
  let moved = false;

  button.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
    button.dataset.dragging = "true";
    button.setPointerCapture(event.pointerId);
  });

  button.addEventListener("pointermove", (event) => {
    if (button.dataset.dragging !== "true") {
      return;
    }

    const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (distance < 6 && !moved) {
      return;
    }

    moved = true;
    const rect = button.getBoundingClientRect();
    const margin = 14;
    const left = Math.min(
      Math.max(event.clientX - rect.width / 2, margin),
      window.innerWidth - rect.width - margin,
    );
    const top = Math.min(
      Math.max(event.clientY - rect.height / 2, margin),
      window.innerHeight - rect.height - margin,
    );

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";
  });

  button.addEventListener("pointerup", (event) => {
    if (button.dataset.dragging !== "true") {
      return;
    }

    button.dataset.dragging = "false";
    button.releasePointerCapture(event.pointerId);

    if (!moved) {
      return;
    }

    const corner = nearestCorner(event.clientX, event.clientY);
    button.dataset.dragged = "true";
    applyFloatingCorner(corner);
    saveFloatingCorner(corner);
  });
}

function createFloatingButton() {
  if (document.getElementById("codetest-study-uploader-open")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "codetest-study-uploader-open";
  button.type = "button";
  button.textContent = "스터디 업로드";
  button.addEventListener("click", (event) => {
    if (button.dataset.dragged === "true") {
      event.preventDefault();
      button.dataset.dragged = "false";
      return;
    }

    openPanel(false);
  });
  document.body.appendChild(button);
  enableFloatingButtonDrag(button);
  restoreFloatingCorner();
}

function createPanel() {
  const wrapper = document.createElement("div");
  wrapper.id = "codetest-study-uploader-panel";
  wrapper.innerHTML = `
    <div class="ctsu-header">
      <div>
        <p class="ctsu-eyebrow">Programmers</p>
        <strong class="ctsu-title"></strong>
        <span class="ctsu-subtitle">통과한 문제만 스터디에 올릴 수 있어요.</span>
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

  if (fromAccepted) {
    acceptedDetected = true;
  }

  const auth = await chrome.runtime.sendMessage({ type: "GET_AUTH_STATUS" });
  const canUpload = updateAcceptedState();
  panel.dataset.open = "true";
  panel.dataset.ready = String(canUpload);
  panel.dataset.corner = currentCorner;
  panel.querySelector(".ctsu-title").textContent = getProblemTitle();
  panel.querySelector(".ctsu-difficulty").value = await detectDifficulty();

  const status = panel.querySelector(".ctsu-status");
  const submitButton = panel.querySelector(".ctsu-submit");
  if (!auth?.loggedIn) {
    submitButton.disabled = true;
    status.textContent = "확장 프로그램 아이콘을 눌러 먼저 로그인해주세요.";
    status.dataset.variant = "error";
    return;
  }

  submitButton.disabled = !canUpload;
  status.textContent = canUpload
    ? "통과가 확인됐어요. 메모를 적고 업로드할 수 있습니다."
    : "아직 통과가 확인되지 않았어요. 통과 후 업로드할 수 있습니다.";
  status.dataset.variant = canUpload ? "success" : "idle";
}

function closePanel() {
  if (panel) {
    panel.dataset.open = "false";
  }
}

async function submitProblem() {
  const submitButton = panel.querySelector(".ctsu-submit");
  const status = panel.querySelector(".ctsu-status");

  if (!updateAcceptedState()) {
    submitButton.disabled = true;
    panel.dataset.ready = "false";
    status.textContent = "문제가 통과된 뒤에만 업로드할 수 있습니다.";
    status.dataset.variant = "error";
    return;
  }

  submitButton.disabled = true;
  status.textContent = "코드와 문제 정보를 읽는 중입니다...";
  status.dataset.variant = "idle";

  const code = await readCodeFromPage();
  const selectedDifficulty = panel.querySelector(".ctsu-difficulty").value;
  const detectedDifficulty = await detectDifficulty();
  const payload = {
    difficulty:
      detectedDifficulty !== "Lv.0" ? detectedDifficulty : selectedDifficulty,
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
    if (!autoOpened && updateAcceptedState()) {
      autoOpened = true;
      openPanel(true);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.setTimeout(() => {
    if (!autoOpened && updateAcceptedState()) {
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
