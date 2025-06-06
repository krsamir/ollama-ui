import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Completion from "./Completion";
import Chat from "./Chat";
import { getOllamaVersionApi, listLocalModelApi, loadModelApi } from "../api";

const Select = styled.select`
  padding: 5px;
  border-radius: 6px;
  width: 200px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.5 : 1)};
  pointer-events: ${({ $isLoading }) => ($isLoading ? "none" : "all")};
`;
const Models = styled.div`
  width: 200px;
  background-color: yellowgreen;
  margin-right: 20px;
  justify-content: end;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  font-weight: 900;
`;

const Separator = styled.div`
  flex: 1;
`;

const ChatContainer = styled.div`
  opacity: ${({ $isLoading }) => ($isLoading ? 0.5 : 1)};
  pointer-events: ${({ $isLoading }) => ($isLoading ? "none" : "all")};
`;

function Index() {
  const [type, setType] = useState("chat");
  const [metaData, setMetaData] = useState({ version: null, listModels: [] });
  const [isLoading, setIsLoading] = useState(false);

  const getModelDetails = useCallback(async () => {
    try {
      const [version, listModels] = await Promise.all([
        getOllamaVersionApi(),
        listLocalModelApi(),
      ]);

      if (listModels?.data?.models[0]) {
        loadModel(listModels?.data?.models[0]?.model);
        setSelectedModel(listModels?.data?.models[0]?.model);
      }
      setMetaData({
        version: version?.data?.version ?? null,
        listModels: listModels?.data?.models ?? [],
      });
    } catch (error) {
      console.log("🚀 ~ getModelDetails ~ error:", error);
    }
  }, []);

  const loadModel = async (name) => {
    try {
      setIsLoading(true);
      await loadModelApi(name);
    } catch (error) {
      console.log("🚀 ~ loadModel ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getModelDetails();
    return () => {};
  }, [getModelDetails]);

  const [selectedModel, setSelectedModel] = useState("");

  const handleModelChange = async ({ target: { value } }) => {
    try {
      await loadModel(value);
    } catch (error) {
      console.log("🚀 ~ handleModelChange ~ error:", error);
    }
    setSelectedModel(value);
  };
  return (
    <>
      <Container $isLoading={isLoading}>
        <Select
          name="type_selector"
          id="type_selector"
          onChange={(e) => setType(e.target.value)}
          value={type}
        >
          <option value="chat">Chat</option>
          <option value="completion">Completion</option>
        </Select>
        <Separator />
        {metaData?.version && <Models>{`OLLAMA ${metaData?.version}`}</Models>}
        {selectedModel && (
          <Models>{`Model ${selectedModel?.toUpperCase()}`}</Models>
        )}
        <Select
          name="type_selector"
          id="type_selector"
          onChange={handleModelChange}
          value={selectedModel}
        >
          {(metaData.listModels ?? []).map(({ name, model }) => (
            <option value={model} key={crypto?.randomUUID()}>
              {name}
            </option>
          ))}
        </Select>
      </Container>
      <ChatContainer $isLoading={isLoading}>
        {type === "chat" && <Chat />}
        {type === "completion" && <Completion />}
      </ChatContainer>
    </>
  );
}

export default Index;
