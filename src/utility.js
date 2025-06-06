export const regex = /^(?=.*[a-zA-Z0-9\s])(?!.*\n+$).*/;

function extractTextWithLineBreaks(html) {
  // Parse the HTML string into a DOM structure
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Function to recursively traverse and collect text with line breaks
  function getText(node) {
    let result = "";

    if (node.nodeType === Node.TEXT_NODE) {
      // Append the node's data as is, preserving line breaks
      result += node.data;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let child of Array.from(node.childNodes)) {
        result += getText(child);
      }
    }

    return result;
  }

  // Get all text nodes and concatenate them with proper line breaks
  const text = doc.body.textContent || "";
  return text;
}

export const handleCopyClipBoard = async (
  text,
  isParseRequired = false,
  selector = ""
) => {
  if (isParseRequired) {
    const transformedText = extractTextWithLineBreaks(
      document.querySelector(`.${selector}`)?.innerHTML
    );
    await navigator.clipboard.writeText(transformedText);
    return;
  }
  await navigator.clipboard.writeText(text);
};
