export const CATEGORIES = [
  { id: "general", name: "General", icon: "📰" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "health", name: "Health", icon: "🏥" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "science", name: "Science", icon: "🔬" },
];

export const PAGE_SIZE = 9;

export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://gnews.io/api/v4",
  apiKey: process.env.REACT_APP_GNEWS_API_KEY,
  language: "en",
};

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};
