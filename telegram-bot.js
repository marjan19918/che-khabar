const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const getNews = require("./main");

// Initialize your bot with your token from BotFather
const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = 107853830; // The ID of the channel or user receiving the news

// Schedule the task for 9:00 AM daily
// Cron format: '0 9 * * *' (Minute, Hour, Day of Month, Month, Day of Week)
cron.schedule("40 10 * * *", async () => {
  try {
    // Call your news-gathering function here
    // const summary = await getNews();
    const news = await getNews();
    const summary = `Here is your daily tech summary...${news}`;

    await bot.telegram.sendMessage(CHAT_ID, summary);
    console.log("Daily news posted successfully!");
  } catch (error) {
    console.error("Failed to send daily news:", error);
  }
});

// Launch the bot
bot.launch();
console.log("Bot is running and scheduler is active...");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
