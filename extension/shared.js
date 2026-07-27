(() => {
  const root = globalThis;
  const namespace = root.CodeTestUploader || {};

  namespace.CONFIG = {
    API_PATHS: {
      LOGIN: "/api/extension/auth/login",
      PROBLEMS: "/api/extension/problems",
      REFRESH: "/api/extension/auth/refresh",
    },
    DEFAULT_API_BASE_URL: "http://localhost:3000",
    DEFAULT_CORNER: "bottom-right",
    DIFFICULTY_CACHE_PREFIX: "programmersDifficulty:",
    FLOATING_CORNERS: ["top-left", "top-right", "bottom-left", "bottom-right"],
    MESSAGE_TYPES: {
      GET_AUTH_STATUS: "GET_AUTH_STATUS",
      UPLOAD_PROBLEM: "UPLOAD_PROBLEM",
    },
    STORAGE_KEYS: {
      ACCESS_TOKEN: "accessToken",
      API_BASE_URL: "apiBaseUrl",
      EXPIRES_AT: "expiresAt",
      MEMBER: "member",
      REFRESH_TOKEN: "refreshToken",
      UPLOADER_CORNER: "uploaderCorner",
      USER: "user",
    },
  };

  namespace.sites = namespace.sites || {
    adapters: [],

    getCurrent() {
      return this.adapters.find((adapter) => adapter.matches(location));
    },

    register(adapter) {
      this.adapters.push(adapter);
    },
  };

  namespace.text = {
    normalize(value) {
      return value?.replace(/\s+/g, " ").trim() || "";
    },
  };

  namespace.storage = {
    clearAuth() {
      const { STORAGE_KEYS } = namespace.CONFIG;

      return chrome.storage.local.remove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.EXPIRES_AT,
        STORAGE_KEYS.MEMBER,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
    },

    getAuth() {
      const { STORAGE_KEYS } = namespace.CONFIG;

      return chrome.storage.local.get([
        STORAGE_KEYS.API_BASE_URL,
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.EXPIRES_AT,
        STORAGE_KEYS.MEMBER,
        STORAGE_KEYS.USER,
      ]);
    },

    getValue(key) {
      return chrome.storage.local.get(key).then((result) => result[key]);
    },

    saveLoginState({ apiBaseUrl, member, session, user }) {
      const { STORAGE_KEYS } = namespace.CONFIG;

      return chrome.storage.local.set({
        [STORAGE_KEYS.ACCESS_TOKEN]: session.accessToken,
        [STORAGE_KEYS.API_BASE_URL]: apiBaseUrl,
        [STORAGE_KEYS.EXPIRES_AT]: session.expiresAt,
        [STORAGE_KEYS.MEMBER]: member,
        [STORAGE_KEYS.REFRESH_TOKEN]: session.refreshToken,
        [STORAGE_KEYS.USER]: user,
      });
    },

    saveSession(session) {
      const { STORAGE_KEYS } = namespace.CONFIG;

      return chrome.storage.local.set({
        [STORAGE_KEYS.ACCESS_TOKEN]: session.accessToken,
        [STORAGE_KEYS.EXPIRES_AT]: session.expiresAt,
        [STORAGE_KEYS.REFRESH_TOKEN]: session.refreshToken,
      });
    },

    setValue(key, value) {
      return chrome.storage.local.set({ [key]: value });
    },
  };

  root.CodeTestUploader = namespace;
})();
