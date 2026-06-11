(() => {
  function readMonacoCode() {
    const pageWindow = window;
    const models = pageWindow.monaco?.editor?.getModels?.();

    if (!Array.isArray(models) || models.length === 0) {
      return "";
    }

    return models
      .map((model) => model?.getValue?.() || "")
      .sort((a, b) => b.length - a.length)[0];
  }

  function readAceCode() {
    const pageWindow = window;
    const editors = Object.values(pageWindow.ace?.editors || {});
    const editor = editors.find((candidate) => candidate?.getValue);
    return editor?.getValue?.() || "";
  }

  window.dispatchEvent(
    new CustomEvent("codetest-study-uploader-code", {
      detail: {
        code: readMonacoCode() || readAceCode(),
      },
    }),
  );
})();
