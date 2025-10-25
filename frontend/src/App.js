// src/App.js
import React, { useState, useEffect } from "react";
import {
  Search,
  Moon,
  Sun,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Constants
const CATEGORIES = [
  { id: "general", name: "General" },
  { id: "technology", name: "Technology" },
  { id: "business", name: "Business" },
  { id: "sports", name: "Sports" },
  { id: "health", name: "Health" },
  { id: "entertainment", name: "Entertainment" },
  { id: "science", name: "Science" },
];

const PAGE_SIZE = 9;
const API_KEY =
  process.env.REACT_APP_GNEWS_API_KEY ||
  "pub_6531178e7b95fda2f63c9c06dc88e9fd90e9e";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const truncateText = (text, maxLength) =>
  !text
    ? ""
    : text.length <= maxLength
    ? text
    : text.substring(0, maxLength) + "...";

// Custom Hook: useDebounce
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Custom Hook: useTheme
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  return { darkMode, toggleTheme };
};

// Component: NewsCard
const NewsCard = ({ article, darkMode }) => {
  const imagePlaceholder =
    "https://via.placeholder.com/400x300?text=News+Image";
  return (
    <article
      className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <img
        src={article.image || imagePlaceholder}
        alt={article.title}
        className="w-full h-48 object-cover"
        onError={(e) => (e.target.src = imagePlaceholder)}
        loading="lazy"
      />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              darkMode
                ? "bg-blue-900 text-blue-300"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {article.source?.name || "Unknown Source"}
          </span>
          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {formatDate(article.publishedAt)}
          </span>
        </div>
        <h2
          className={`text-xl font-bold mb-3 line-clamp-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {article.title}
        </h2>
        <p
          className={`mb-4 line-clamp-3 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {truncateText(article.description || article.content, 150) ||
            "No description available."}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 rounded-md text-gray-900 font-semibold 
            bg-gradient-to-r from-gray-100 to-gray-400 
            hover:from-gray-500 hover:to-white 
            dark:from-gray-700 dark:to-gray-600 dark:text-white dark:hover:from-gray-600 dark:hover:to-gray-500
            transition-all"
        >
          Read More →
        </a>
      </div>
    </article>
  );
};

// Header Component (with logo + gradient buttons)
const Header = ({
  searchQuery,
  onSearchChange,
  onSearch,
  darkMode,
  onToggleTheme,
}) => {
  const handleKeyPress = (e) => e.key === "Enter" && onSearch();

  return (
    <header
      className={`sticky top-0 z-50 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-b shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-12 h-8 object-contain"
            />
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-cyan-400" : "text-gray-800"
              }`}
            >
              NewsSphere
            </h1>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-gradient-to-r from-gray-400 to-white hover:from-white hover:to-gray-100 
              dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500
              text-gray-700 dark:text-white transition-transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`w-full px-4 py-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-50 text-gray-900 border-gray-300"
            }`}
          />
          <Search
            className={`absolute left-4 top-3.5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
            size={20}
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-2 px-4 py-1.5 rounded-md font-semibold
              bg-gradient-to-r from-gray-400 to-white hover:from-white hover:to-gray-100 
              dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500
              text-gray-900 dark:text-white transition-all"
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
};

// CategoryFilter and Pagination updated to use same gradient button style
const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  darkMode,
}) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <Filter
      size={20}
      className={darkMode ? "text-gray-400" : "text-gray-600"}
    />
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onCategoryChange(cat.id)}
        className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all
          ${
            activeCategory === cat.id
              ? "bg-gradient-to-r from-gray-900 dark:from-gray-400 dark:to-gray-600 text-gray-100 dark:text-white"
              : "bg-gradient-to-r from-gray-500 to-gray-200 hover:from-white hover:to-gray-100 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300"
          }`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

const Pagination = ({ page, hasMore, onPrev, onNext, darkMode }) => (
  <div className="flex items-center justify-center gap-4 mt-8">
    <button
      onClick={onPrev}
      disabled={page === 1}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
        ${
          page === 1
            ? "opacity-50 cursor-not-allowed bg-gradient-to-r from-gray-400 to-white dark:from-gray-700 dark:to-gray-600"
            : "bg-gradient-to-r from-gray-400 to-white hover:from-white hover:to-gray-100 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500"
        } text-gray-900 dark:text-white`}
    >
      <ChevronLeft size={20} /> Previous
    </button>

    <span
      className={`px-4 py-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
    >
      Page {page}
    </span>

    <button
      onClick={onNext}
      disabled={!hasMore}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
        ${
          !hasMore
            ? "opacity-50 cursor-not-allowed bg-gradient-to-r from-gray-400 to-white dark:from-gray-700 dark:to-gray-600"
            : "bg-gradient-to-r from-gray-400 to-white hover:from-white hover:to-gray-100 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500"
        } text-gray-900 dark:text-white`}
    >
      Next <ChevronRight size={20} />
    </button>
  </div>
);

// Main App
function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("general");
  const [page, setPage] = useState(1);

  const { darkMode, toggleTheme } = useTheme();
  const debouncedSearch = useDebounce(searchQuery, 800);

  const fetchNews = async (search = "", cat = category, pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = search
        ? `/search?q=${encodeURIComponent(search)}`
        : `/top-headlines?category=${cat}`;
      const url = `${API_BASE_URL}${endpoint}&lang=en&max=${PAGE_SIZE}&page=${pageNum}&apikey=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Failed to fetch news (status ${res.status})`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
      fetchNews(debouncedSearch, category, 1);
    }
  }, [debouncedSearch]);

  const handleSearch = () => {
    setPage(1);
    fetchNews(searchQuery, category, 1);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={category}
          onCategoryChange={(cat) => {
            setCategory(cat);
            setSearchQuery("");
            setPage(1);
            fetchNews("", cat, 1);
          }}
          darkMode={darkMode}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={48} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p>{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <NewsCard key={i} article={article} darkMode={darkMode} />
              ))}
            </div>
            <Pagination
              page={page}
              hasMore={articles.length === PAGE_SIZE}
              onPrev={() => {
                if (page > 1) fetchNews(searchQuery, category, page - 1);
                setPage((p) => Math.max(1, p - 1));
              }}
              onNext={() => {
                fetchNews(searchQuery, category, page + 1);
                setPage((p) => p + 1);
              }}
              darkMode={darkMode}
            />
          </>
        ) : (
          <p className="text-center text-gray-400 py-20">
            No articles found. Try a different search.
          </p>
        )}
      </main>

      <footer
        className={`mt-12 py-6 ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
        } border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 NewsSphere. Powered by GNews API</p>
          <p className="text-sm mt-2">Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
