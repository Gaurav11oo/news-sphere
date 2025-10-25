const axios = require("axios");

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

exports.getHeadlines = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { max = 9 } = req.query;

    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        category,
        lang: "en",
        max,
        apikey: GNEWS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.searchNews = async (req, res, next) => {
  try {
    const { q, max = 9 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        q,
        lang: "en",
        max,
        apikey: GNEWS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};
