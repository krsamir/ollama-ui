import { useCallback, useMemo } from 'react';
import { generateCompletionApi, generateChatApi, IMessage } from '../api';

const useAI = () => {
  const generateContentOnQuery = useCallback(({ query }: { query: string }) => {
    return generateCompletionApi({ query });
  }, []);

  const generateChatQuery = useCallback(({ messages }: IMessage) => {
    return generateChatApi({ messages });
  }, []);

  return useMemo(
    () => ({ generateContentOnQuery, generateChatQuery }),
    [generateContentOnQuery, generateChatQuery],
  );
};

export default useAI;
