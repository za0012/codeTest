const { DEFAULT_CORNER, FLOATING_CORNERS, MESSAGE_TYPES, STORAGE_KEYS } =
  CodeTestUploader.CONFIG;

const siteAdapter = CodeTestUploader.sites.getCurrent();
let panel;
let observer;
let autoOpened = false;
let acceptedDetected = false;
let currentCorner = DEFAULT_CORNER;

function getDifficultyLevels() {
  return siteAdapter?.levels?.length ? siteAdapter.levels : ["Lv.0"];
}

function updateAcceptedState() {
  if (siteAdapter.looksAccepted()) {
    acceptedDetected = true;
  }

  return acceptedDetected;
}

function isFloatingCorner(value) {
  return FLOATING_CORNERS.includes(value);
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
  const corner = await CodeTestUploader.storage.getValue(
    STORAGE_KEYS.UPLOADER_CORNER,
  );
  applyFloatingCorner(corner);
}

function saveFloatingCorner(corner) {
  CodeTestUploader.storage.setValue(STORAGE_KEYS.UPLOADER_CORNER, corner);
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
        <p class="ctsu-eyebrow">${siteAdapter.label}</p>
        <strong class="ctsu-title"></strong>
        <span class="ctsu-subtitle">통과한 문제만 스터디에 올릴 수 있어요.</span>
      </div>
      <button class="ctsu-close" type="button" aria-label="닫기">×</button>
    </div>
    <label class="ctsu-field">
      <span>난이도</span>
      <select class="ctsu-difficulty">
        ${getDifficultyLevels()
          .map((level) => `<option value="${level}">${level}</option>`)
          .join("")}
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

  const auth = await chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_AUTH_STATUS,
  });
  const canUpload = updateAcceptedState();
  panel.dataset.open = "true";
  panel.dataset.ready = String(canUpload);
  panel.dataset.corner = currentCorner;
  panel.querySelector(".ctsu-eyebrow").textContent = siteAdapter.label;
  panel.querySelector(".ctsu-title").textContent =
    siteAdapter.getProblemTitle();
  panel.querySelector(".ctsu-difficulty").value =
    await siteAdapter.detectDifficulty();

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

  const code = await siteAdapter.readCodeFromPage();
  const selectedDifficulty = panel.querySelector(".ctsu-difficulty").value;
  const detectedDifficulty = await siteAdapter.detectDifficulty();
  const payload = {
    difficulty:
      detectedDifficulty !== "Lv.0" ? detectedDifficulty : selectedDifficulty,
    memo: panel.querySelector(".ctsu-memo").value,
    solution: code,
    tags: siteAdapter.getProblemTags(),
    title: siteAdapter.getProblemTitle(),
    url: siteAdapter.getProblemUrl(),
  };

  chrome.runtime.sendMessage(
    { payload, type: MESSAGE_TYPES.UPLOAD_PROBLEM },
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

if (siteAdapter) {
  createFloatingButton();
  startAcceptedObserver();
}

window.addEventListener("beforeunload", () => observer?.disconnect());
