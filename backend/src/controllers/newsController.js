const axios = require("axios");

const API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

exports.getHeadlines = async (req, res, next) => {
  try {
    const category = req.params.category || "general";
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        category,
        lang: "en",
        max: 10,
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.searchNews = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query parameter 'q' required" });

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: query,
        lang: "en",
        max: 10,
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};
