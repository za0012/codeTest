(() => {
  const namespace = globalThis.CodeTestUploader;
  const { DIFFICULTY_CACHE_PREFIX } = namespace.CONFIG;
  const { normalize } = namespace.text;

  let stableProblemTitle = "";

  function cleanProblemTitle(value) {
    return normalize(value)
      .replace(/^코딩테스트 연습\s*-\s*/, "")
      .replace(/\s*\|\s*프로그래머스(?:\s*스쿨)?\s*$/, "")
      .replace(/\s*-\s*프로그래머스(?:\s*스쿨)?\s*$/, "")
      .trim();
  }

  function isResultTitle(value) {
    return (
      !value ||
      /채점|결과|점수|테스트|실행|정답|통과|실패|제출/.test(value) ||
      /^\d+(?:\.\d+)?\s*점?$/.test(value)
    );
  }

  function readTitleFromDocumentTitle() {
    return cleanProblemTitle(document.title);
  }

  function readTitleFromPageHeading() {
    const heading =
      document.querySelector("h2") ||
      document.querySelector("h1") ||
      document.querySelector("[class*='title']");

    return cleanProblemTitle(heading?.textContent);
  }

  function captureStableProblemTitle() {
    const candidates = [
      readTitleFromDocumentTitle(),
      readTitleFromPageHeading(),
    ];

    for (const candidate of candidates) {
      if (!isResultTitle(candidate)) {
        stableProblemTitle = candidate;
        return stableProblemTitle;
      }
    }

    return "";
  }

  function getProblemTitle() {
    if (stableProblemTitle) {
      return stableProblemTitle;
    }

    return captureStableProblemTitle() || readTitleFromDocumentTitle();
  }

  function getProblemTags() {
    const candidates = Array.from(
      document.querySelectorAll(
        "nav a, ol a, .breadcrumb a, [class*='breadcrumb'] a",
      ),
    )
      .map((element) => normalize(element.textContent))
      .filter(Boolean)
      .filter((tag) => !["코딩테스트 연습", "프로그래머스"].includes(tag));

    return Array.from(new Set(candidates)).slice(0, 5);
  }

  function parseDifficultyFromText(text) {
    const normalizedText = normalize(text);
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
        .map(
          (element) => element.getAttribute("content") || element.textContent,
        )
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

    return namespace.storage.getValue(`${DIFFICULTY_CACHE_PREFIX}${lessonId}`);
  }

  function setCachedDifficulty(lessonId, difficulty) {
    if (!lessonId || !difficulty || difficulty === "Lv.0") {
      return;
    }

    namespace.storage.setValue(
      `${DIFFICULTY_CACHE_PREFIX}${lessonId}`,
      difficulty,
    );
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

      const text = normalize(element.textContent);
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
    const text = normalize(document.body.innerText);

    return (
      /정답입니다|모든 테스트.*통과|채점 결과.*통과|합계:\s*100\.0/.test(
        text,
      ) && !/실패|오답|컴파일 에러|런타임 에러/.test(text)
    );
  }

  namespace.sites.register({
    label: "Programmers",
    levels: ["Lv.0", "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5"],
    matches(currentLocation) {
      return currentLocation.hostname === "school.programmers.co.kr";
    },
    detectDifficulty,
    getProblemTags,
    getProblemTitle,
    getProblemUrl,
    looksAccepted,
    readCodeFromPage,
  });

  captureStableProblemTitle();
})();
