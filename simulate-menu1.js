#!/usr/bin/env node
require('dotenv').config();
const { spawn } = require('child_process');

function sendReport(title, body) {
  return new Promise((resolve, reject) => {
    const sendReportProc = spawn('node', [__dirname + '/send-report.cjs', title]);
    sendReportProc.stdin.write(body);
    sendReportProc.stdin.end();

    sendReportProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`send-report exited with code ${code}`));
    });
  });
}

(async () => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  
  const autoClaimLog = `⏱️ Waktu Claim: ${timestamp}
💳 Wallet: ${maskWallet(process.env.WALLET)}
🎯 Simulasi Claim berhasil.
Reward: 0.0000 NPT
Block height: 123456
Tx Hash: 0xSIMULATEDTXHASH1234`;

  const syncLog = `✅ Simulasi Node sync selesai
Current block: 123456
Peer connected: 8`;

  try {
    await sendReport(`Auto Claim - ${timestamp}`, autoClaimLog);
    await sendReport(`Sync Node - ${timestamp}`, syncLog);
    console.log('✅ Simulasi Menu 1 selesai, report terkirim');
  } catch (err) {
    console.error('❌ Gagal kirim report simulasi:', err);
  }
})();

function maskWallet(wallet) {
  if (!wallet || wallet.length < 10) return wallet || '';
  return wallet.slice(0, 6) + '********' + wallet.slice(-4);
}
