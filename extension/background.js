importScripts("shared.js", "api-client.js");

const { MESSAGE_TYPES } = CodeTestUploader.CONFIG;

function buildAuthStatus(auth) {
  return {
    loggedIn: Boolean(auth.accessToken),
    member: auth.member,
    user: auth.user,
  };
}

async function handleUploadProblem(payload) {
  const auth = await CodeTestUploader.storage.getAuth();

  if (!auth.accessToken) {
    throw new Error("확장 프로그램에서 먼저 로그인해주세요.");
  }

  return CodeTestUploader.api.uploadProblem(payload, auth);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === MESSAGE_TYPES.GET_AUTH_STATUS) {
    CodeTestUploader.storage
      .getAuth()
      .then((auth) => {
        sendResponse(buildAuthStatus(auth));
      })
      .catch((error) => {
        sendResponse({ error: error.message, loggedIn: false });
      });

    return true;
  }

  if (message?.type === MESSAGE_TYPES.UPLOAD_PROBLEM) {
    handleUploadProblem(message.payload)
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
