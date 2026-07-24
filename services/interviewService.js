import axios from "axios";

// Change this if your backend URL is different.
const API_URL = "http://localhost:5000/api/interviews";

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------
// Interview APIs
// ----------------------

export const getRoles = async () => {
  const res = await api.get("/roles");
  return res.data;
};

export const startInterview = async (roleId) => {
  const res = await api.post("/start", { roleId });
  return res.data;
};

export const getCurrentQuestion = async (sessionId) => {
  const res = await api.get(`/${sessionId}/question`);
  return res.data;
};

export const submitAnswer = async (sessionId, answer) => {
  const res = await api.post(`/${sessionId}/answer`, {
    answer,
  });

  return res.data;
};

export const finishInterview = async (sessionId) => {
  const res = await api.post(`/${sessionId}/finish`);
  return res.data;
};

export const getProgress = async (sessionId) => {
  const res = await api.get(`/${sessionId}/progress`);
  return res.data;
};

export const getHistory = async () => {
  const res = await api.get("/history");
  return res.data;
};

// ----------------------
// Error Helper
// ----------------------

export const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

export default api;