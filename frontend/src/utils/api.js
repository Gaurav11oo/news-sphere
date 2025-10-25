import axios from "axios";
import { API_CONFIG, PAGE_SIZE } from "./constants";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 10000,
});

export const fetchNewsByCategory = async (category, max = PAGE_SIZE) => {
  try {
    const response = await api.get("/top-headlines", {
      params: {
        category,
        lang: API_CONFIG.language,
        max,
        apikey: API_CONFIG.apiKey,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch news");
  }
};

export const searchNews = async (query, max = PAGE_SIZE) => {
  try {
    const response = await api.get("/search", {
      params: {
        q: query,
        lang: API_CONFIG.language,
        max,
        apikey: API_CONFIG.apiKey,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to search news");
  }
};
