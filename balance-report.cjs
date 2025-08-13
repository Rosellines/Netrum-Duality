#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { getWalletReport, getETHBalance } = require('./get-npt-balance.cjs');
const { maskWallet, getTimestamp } = require('./utility.cjs');
const { spawn } = require('child_process');

(async () => {
  const wallet = process.env.WALLET;
  if (!wallet) {
    console.error("❌ WALLET tidak ditemukan di .env");
    process.exit(1);
  }

  const timeNow = getTimestamp();
  const walletMasked = maskWallet(wallet);

  const reportData = await getWalletReport(wallet);
  const ethBalance = await getETHBalance(wallet);

  // Baca tx hash terakhir (disimpan Menu 1/3)
  const txHashFile = path.join(__dirname, 'last_tx_hash.txt');
  let lastTxHash = 'Belum ada transaksi';
  try {
    if (fs.existsSync(txHashFile)) {
      const raw = fs.readFileSync(txHashFile, 'utf8').trim();
      if (raw && /^0x[a-fA-F0-9]{64}$/.test(raw)) lastTxHash = raw;
    }
  } catch {}

  const report = `⏱️ Waktu Cek: ${timeNow}
💳 Wallet: ${walletMasked}
💰 NPT Balance: ${reportData.balance}
🔗 Base Name: ${reportData.baseName}
Ξ  ETH Balance : ${ethBalance} ETH
📜 Tx Hash     : ${lastTxHash}`;

  const sendReport = spawn('node', [path.join(__dirname, 'send-report.cjs'), 'Cek Balance']);
  sendReport.stdin.write(report);
  sendReport.stdin.end();
})();

