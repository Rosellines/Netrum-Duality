#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');

const title = process.argv[2] || "Report";
let body = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => {
    body += chunk;
});
process.stdin.on("end", async () => {
    const message = `📢 **${title}**\n\`\`\`\n${body}\n\`\`\``;

    async function sendWithRetry(sendFunc, platform) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await sendFunc();
                console.log(`✅ Terkirim ke ${platform}: ${title}`);
                return;
            } catch (err) {
                console.error(`❌ [${platform}] Gagal kirim (Percobaan ${attempt}):`, err.message);
                if (attempt < 3) {
                    console.log(`⏳ Retry dalam 10 detik...`);
                    await new Promise(res => setTimeout(res, 10000));
                }
            }
        }
        console.error(`🚫 Gagal kirim ke ${platform} setelah 3 percobaan.`);
    }

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        await sendWithRetry(async () => {
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            });
        }, "Telegram");
    } else {
        console.error("❌ TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID kosong di .env");
    }

    if (process.env.DISCORD_WEBHOOK_URL) {
        await sendWithRetry(async () => {
            await axios.post(process.env.DISCORD_WEBHOOK_URL, { content: message });
        }, "Discord");
    } else {
        console.error("❌ DISCORD_WEBHOOK_URL kosong di .env");
    }
});
