import React, { useEffect, useRef } from "react";

function TextBox({
  query,
  setQuery,
  handleGenerate,
  handleClearContent,
  isLoading,
}) {
  const ref = useRef(null);

  useEffect(() => {
    ref?.current?.focus();
  }, []);

  return (
    <>
      <div className="ollama-container">
        <textarea
          ref={ref}
          className="ollama-text ollama-shadow"
          placeholder="Ask Anything ~ qwen2.5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey === false) {
              handleGenerate();
            }
          }}
          disabled={isLoading}
          cols={50}
          rows={10}
        />
      </div>
      <div className="ollama-container">
        <button
          className="ollama-btn ollama-shadow"
          type="submit"
          onClick={() => setQuery("")}
          disabled={isLoading}
        >
          X
        </button>
        <button
          className="ollama-btn ollama-shadow"
          type="submit"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          Send
        </button>
        <button
          className="ollama-btn ollama-shadow"
          type="submit"
          onClick={handleClearContent}
          disabled={isLoading}
        >
          Clear All
        </button>
      </div>
    </>
  );
}

export default TextBox;
