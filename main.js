require("dotenv").config();
const Parser = require("rss-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const parser = new Parser();
// Initialize Gemini with your API Key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FEEDS = [
  "https://hnrss.org/frontpage",
  "http://feeds.arstechnica.com/arstechnica/index/",
  "https://www.technologyreview.com/feed/",
  "https://www.wired.com/feed/rss",
  "https://thehackernews.com/feeds/posts/default",
];

async function getNews() {
  let allArticles = [];

  // Fetch from all sources
  for (const url of FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      allArticles.push(...feed.items.slice(0, 4));
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
    }
  }

  // Initialize the model (Flash is fast, cheap/free, and perfect for summarization)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const newsPrompt = `Act as a senior tech editor. Here are 20 technology headlines: ${JSON.stringify(
    allArticles.map((a) => a.title)
  )}. 
    Please select the 5 most important, rank them by impact, and provide a 1-sentence summary for each.`;

  // Generate content
  const result = await model.generateContent(newsPrompt);
  const response = await result.response;
  const text = response.text();

  console.log("--- Daily Top 5 Tech News ---");
  console.log(text);
}

getNews();
