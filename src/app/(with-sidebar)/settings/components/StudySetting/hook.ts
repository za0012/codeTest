export const handleCopyClipBoard = async (text: string) => {
  if (!text) return;
  await navigator.clipboard.writeText(text);
};
