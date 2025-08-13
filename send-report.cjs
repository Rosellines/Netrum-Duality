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
    let jsonData;
    try {
        jsonData = JSON.parse(body); // data JSON dari bash
    } catch {
        jsonData = { rawText: body.trim() }; // fallback
    }

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

    // Kirim ke Telegram (tetap text biasa)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const message = `📢 **${title}**\n\`\`\`\n${body}\n\`\`\``;
        await sendWithRetry(async () => {
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            });
        }, "Telegram");
    }

    // Kirim ke Discord (embed)
    if (process.env.DISCORD_WEBHOOK_URL) {
        await sendWithRetry(async () => {
            let embedPayload;

            if (jsonData.baseName && jsonData.nptBalance && jsonData.ethBalance) {
                embedPayload = {
                    username: "Netrum Duality",
                    avatar_url: "https://i.ibb.co/0c8NPK5/netrum-avatar.png",
                    embeds: [
                        {
                            color: 0xF1C40F,
                            title: title,
                            fields: [
                                { name: "📛 Base Name", value: jsonData.baseName, inline: false },
                                { name: "💰 NPT Balance", value: jsonData.nptBalance, inline: true },
                                { name: "📊 ETH Balance", value: jsonData.ethBalance, inline: true }
                            ],
                            footer: { text: "NETRUM AI Mining System" },
                            timestamp: new Date()
                        }
                    ]
                };
            } else {
                embedPayload = { content: `📢 **${title}**\n\`\`\`\n${body}\n\`\`\`` };
            }

            await axios.post(process.env.DISCORD_WEBHOOK_URL, embedPayload);
        }, "Discord");
    }
});
