import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import useAI from "../../hooks";
import TextBox from "../TextBox";
import { handleCopyClipBoard, regex } from "../../utility";

function Completion() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    return () => {
      setData([]);
    };
  }, []);

  const handleClearContent = () => setData([]);

  const { generateContentOnQuery } = useAI();

  const handleGenerate = async () => {
    try {
      console.info(regex.test(query));
      if (regex.test(query) && query?.length > 0) {
        setIsLoading(true);
        const { data: res } = await generateContentOnQuery({ query });
        const result = [...data];
        result.unshift({
          id: crypto?.randomUUID(),
          data: res.response,
          createdAt: res.created_at,
          question: query,
        });
        setData(result);
        setQuery("");
      } else {
        alert("Nothing to search!");
      }
    } catch (error) {
      console.info(error);
      setQuery((prev) => prev);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ollama-main-container">
      <TextBox
        query={query}
        setQuery={setQuery}
        handleGenerate={handleGenerate}
        handleClearContent={handleClearContent}
        isLoading={isLoading}
      />
      {isLoading && <h2 className="ollama-loading">Loading....</h2>}
      <div className="ollama-main-response">
        {data?.map(({ data: item, id, createdAt, question }) => (
          <div className="ollama-answer-box ollama-shadow" key={id}>
            <div className="ollama-q-cont">
              <div className="ollama-copy">
                <span
                  className="material-symbols-outlined"
                  onClick={() => handleCopyClipBoard(question)}
                >
                  content_copy
                </span>
              </div>
              <div className="ollama-question">{question}</div>
            </div>
            <div className="ollama-q-cont">
              <div className={`ollama-markdown ollam-content-${id}`}>
                <ReactMarkdown remarkPlugins={[gfm]}>{item}</ReactMarkdown>
              </div>
              <div className="ollama-copy">
                <span
                  className="material-symbols-outlined"
                  onClick={() =>
                    handleCopyClipBoard(item, true, `ollam-content-${id}`)
                  }
                >
                  content_copy
                </span>
              </div>
            </div>
            <div className="ollama-timestamp">
              {String(new Date(createdAt))?.replace(
                "GMT+0530 (India Standard Time)",
                ""
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Completion;
