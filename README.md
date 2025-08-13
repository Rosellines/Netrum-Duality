# 🔥 Netrum Duality 🔥 
# AI Mining System - Telegram & Discord Report

A professional Telegram reporting system for Netrum AI mining operations on Base network. This system provides real-time status updates, balance monitoring, and mining cycle notifications directly to your Telegram chat.

## ✨ Features

- **🚀 Real-time Mining Status**: Get instant notifications when mining starts, claims are processed, and cycles restart
- **💰 Balance Monitoring**: Track both NPT token and ETH balances on Base network
- **💰 Auto Claim After 24 Hours + Report 2 Hours** : Integrated with auto claim every 24hr and send report balance every 2hr on discord or telegram. and you can use both
- **🏷️ Base Name Resolution**: Automatic resolution of Base network usernames
- **📱 Telegram Integration**: Clean, professional reports sent directly to Telegram
- **📱 Discord Inteegration with webhook**: Fast, Clean, professional reports sent directly to your server Discord 
- **⚡ Multi-Report Types**: Support for start, claim, and complete notifications
- **🛡️ Error Handling**: Robust error handling with fallback values

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- dos2unix
- Telegram Bot Token
- Discord Webhook
- Base network RPC access
- Environment variables configured

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rosellines/Netrum-Duality.git
   cd Netrum-Duality
   ```

2. **Install dependencies**:
   ```bash
   apt install dos2unix -y
   npm install axios dotenv ethers
   ```

3. **Set permissions**:
   ```bash
   chmod +x send-report.cjs balance-report.cjs netrum-auto.sh get-npt-balance.js
   find . -type f \( -name "*.sh" -o -name "*.js" -o -name "*.cjs" -o -name "*.json" -o -name "*.md" \) -exec dos2unix {} \;
   chmod +x *.sh *.cjs *.js 2>/dev/null
   ```

4. **Configure environment**:
   ```bash
   nano .env
   ```
   
   Create a `.env` file with:
   ```env
   BOT_TOKEN=your_telegram_bot_token
   CHAT_ID=your_telegram_chat_id
   WALLET=your_wallet_address
   ```

## 📱 Telegram Bot Setup

1. **Create a Telegram Bot**:
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Use `/newbot` command
   - Follow the instructions to create your bot
   - Copy the bot token

2. **Get Chat ID**:
   - Start a chat with your bot
   - Send any message
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response

## 🚀 Quick Start

1. **Create screen session**:
   ```bash
   screen -S netrumauto
   ```

2. **Run the mining script**:
   ```bash
   ./netrum-auto.sh
   ```

3. **Detach from screen**: Press `Ctrl+A` then `D` to run in background

## 📊 Report Types & Usage

### Start Mining Report
```bash
node send-report.js start
```

### Claim Processing Report
```bash
node send-report.js claim
```

### Complete & Restart Report
```bash
node send-report.js complete
```

### Default (Start) Report
```bash
node send-report.js
```

## 📸 Example Output

![Telegram Report Example](image.png)

The system generates clean, professional reports with:
- 🔥 **System Status Header**
- ⚡ **Operation Details**
- 💰 **Balance Information**
- 🏷️ **Base Network Username**
- ⛽ **ETH Gas Balance**

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram bot token from BotFather | ✅ |
| `CHAT_ID` | Your Telegram chat ID | ✅ |
| `WALLET` | Ethereum wallet address to monitor | ✅ |

### Network Configuration

The system is configured for Base network with:
- **NPT Contract**: `0xb8c2ce84f831175136cebbfd48ce4bab9c7a6424`
- **Base Name Resolver**: `0xC6d566A56A1aFf6508b41f6c90ff131615583BCD`
- **Reverse Registrar**: `0x79ea96012eea67a83431f1701b3dff7e37f9e282`

## 🏗️ Project Structure

```
netrum-auto/
├── send-report.js          # Main reporting script
├── erc20-abi.js           # ERC20 contract ABI
├── get-npt-balance.js     # NPT balance utility
├── netrum-auto.sh         # Shell automation script
├── package.json           # Node.js dependencies
├── README.md              # Documentation
└── .env                   # Environment variables
```

## 🔍 Core Functions

### `getNPTBalance(address)`
Fetches NPT token balance from Base network contract.

### `getETHBalance(address)`
Retrieves native ETH balance for gas calculations.

### `getBaseUsername(address)`
Resolves Base network username (e.g., `username.base.eth`).

### `sendTelegramReport(message)`
Sends formatted message to configured Telegram chat.

### `generateReport(type)`
Main function that orchestrates balance fetching and report generation.

## 🛡️ Error Handling

Comprehensive error handling includes:
- **Network Errors**: Graceful fallback to default values
- **Contract Errors**: Returns "0.0000" for failed balance queries
- **Telegram Errors**: Logs errors with HTTP status codes
- **Username Resolution**: Falls back to "No .base name" if resolution fails

## 🔄 Automation Integration

Example integration with mining automation:

```bash
# Start mining
./netrum-auto.sh &
node send-report.js start

# After 24 hours (automated)
node send-report.js claim
# Process claim...
node send-report.js complete
```


## ⚠️ Disclaimer

This tool is for educational and monitoring purposes only. Always ensure you comply with the terms of service of the platforms and networks you interact with.

## 🙏 Credits

- **Jhinkz** - System Developer & Maintainer
- **Base Network** - Infrastructure provider
- **Netrum AI** - Mining platform
- **Community** - Feedback and support

---

**Made with ❤️ by Jhinkz**

*Happy Mining! ⛏️*
