import { useCallback, useMemo } from "react";
import { generateCompletionApi, generateChatApi } from "../api";

const useAI = () => {
  const generateContentOnQuery = useCallback(({ query, selectedModel }) => {
    return generateCompletionApi({ query, selectedModel });
  }, []);

  const generateChatQuery = useCallback(({ messages, selectedModel }) => {
    return generateChatApi({ messages, selectedModel });
  }, []);

  return useMemo(
    () => ({ generateContentOnQuery, generateChatQuery }),
    [generateContentOnQuery, generateChatQuery]
  );
};

export default useAI;
