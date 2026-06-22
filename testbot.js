require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

async function testSendMessage() {
  try {
    console.log("Attempting to send test message to:", process.env.CHAT_ID);
    await bot.telegram.sendMessage(
      process.env.CHAT_ID,
      "🚀 Test successful! The bot is working."
    );
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Failed to send message:", error.message);
  }
}

testSendMessage();
