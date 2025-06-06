import axios from "axios";

const BASE_URL = "http://localhost:11434";
const MODEL = "qwen2.5:latest";

export const generateCompletionApi = ({ query }) =>
  axios.post(`${BASE_URL}/api/generate`, {
    model: MODEL,
    prompt: query,
    stream: false,
  });

export const generateChatApi = ({ messages }) =>
  axios.post(`${BASE_URL}/api/chat`, {
    model: MODEL,
    messages,
    stream: false,
  });

export const getOllamaVersionApi = () => axios.get(`${BASE_URL}/api/version`);

export const listLocalModelApi = () => axios.get(`${BASE_URL}/api/tags`);

export const showModelDetailsApi = (name) =>
  axios.get(`${BASE_URL}/api/show`, { name });

export const loadModelApi = (model) =>
  axios.post(`${BASE_URL}/api/generate`, { model });

export { MODEL };
