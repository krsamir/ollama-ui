import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import useAI from "../../hooks";
import TextBox from "../TextBox";
import { handleCopyClipBoard, regex } from "../../utility";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 450px);
  overflow-x: auto;
  padding: 20px;
`;

const ReplyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ $isRight }) => ($isRight ? "flex-end" : "flex-start")};
`;

const ReplyItem = styled.div`
  max-width: 500px;
  min-width: 200px;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
`;
const Content = styled.div`
  line-height: 1.4em;
  padding-bottom: 5px;
`;

const Timestamp = styled.div`
  padding-top: 5px;
  font-size: 10px;
  text-align: end;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
`;
function Chat() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([
    {
      id: crypto.randomUUID(),
      role: "system",
      content: "You are an helpful assistant.",
      created_at: new Date()?.toString(),
    },
  ]);

  const handleClearContent = () =>
    setData([
      {
        id: crypto.randomUUID(),
        role: "system",
        content: "You are an helpful assistant.",
        created_at: new Date()?.toString(),
      },
    ]);

  const { generateChatQuery } = useAI();

  useEffect(() => {
    // return () => {
    //   setData([
    //     {
    //       id: crypto.randomUUID(),
    //       role: 'system',
    //       content: 'You are an helpful assistant.',
    //       created_at: new Date()?.toString(),
    //     },
    //   ]);
    // };
  }, []);

  const handleGenerate = async () => {
    try {
      if (regex.test(query) && query?.length > 0) {
        setIsLoading(true);
        const { data: res } = await generateChatQuery({
          messages: [...data, { role: "user", content: query }]?.map(
            ({ role, content }) => ({ role, content })
          ),
        });
        setData([
          {
            ...res?.message,
            id: crypto.randomUUID(),
            created_at: res?.created_at,
          },
          {
            role: "user",
            content: query,
            id: crypto?.randomUUID(),
            created_at: new Date()?.toString(),
          },
          ...data,
        ]);
        setQuery("");
      } else {
        // alert('Nothing to search!');
      }
    } catch (error) {
      console.info(error);
      setQuery((prev) => prev);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="ollama-main-container">
        <TextBox
          query={query}
          setQuery={setQuery}
          handleGenerate={handleGenerate}
          handleClearContent={handleClearContent}
          isLoading={isLoading}
        />
        {isLoading && <h2 className="ollama-loading">Loading....</h2>}
        <Container>
          {data
            .slice(0, data?.length - 1)
            ?.map(({ role, content, created_at, id }) => (
              <ReplyContainer
                key={id}
                $isRight={role === "user"}
                className="replycontainer"
              >
                <ReplyItem className="replyitem ollama-shadow">
                  <Content className={`ollam-content-${id}`}>
                    <ReactMarkdown remarkPlugins={[gfm]}>
                      {content}
                    </ReactMarkdown>
                  </Content>
                  <Timestamp>
                    <span
                      className="material-symbols-outlined copy-icon"
                      onClick={() =>
                        handleCopyClipBoard(
                          content,
                          true,
                          `ollam-content-${id}`
                        )
                      }
                    >
                      content_copy
                    </span>
                    {String(new Date(created_at))?.replace(
                      "GMT+0530 (India Standard Time)",
                      ""
                    )}
                  </Timestamp>
                </ReplyItem>
              </ReplyContainer>
            ))}
        </Container>
      </div>
    </div>
  );
}

export default Chat;
