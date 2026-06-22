require("dotenv").config();
const Parser = require("rss-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const parser = new Parser({
  timeout: 90000,
});
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const newsPrompt = ` You are a technical editor. Summarize the following news into a JSON array of 5 items. 
- Use ONLY the provided headlines. 
- If a headline is ambiguous, ignore it. 
- Output format: [{"title": "Headline", "summary": "One sentence summary",source:"full source"}]
- If you are not 100% sure about a summary, omit it.
- TEMPERATURE: 0

Headlines: ${JSON.stringify(allArticles)}
    `;

  // Generate content
  const result = await model.generateContent(newsPrompt);
  const response = await result.response;
  const text = response.text();

  console.log("--- Daily Top 5 Tech News ---");
  console.log(text);
}

getNews();
