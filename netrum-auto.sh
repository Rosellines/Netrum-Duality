#!/bin/bash

NODE_DIR="/root/netrum-lite-node/Netrum-Duality"
SEND_REPORT="$NODE_DIR/send-report.cjs"
TXHASH_FILE="$NODE_DIR/last_tx_hash.txt"

send_log() {
    local title="$1"
    local log="$2"
    echo "$log" | node "$SEND_REPORT" "$title"
    if [ $? -ne 0 ]; then
        echo "⚠️  Gagal mengirim report: $title"
    fi
}

extract_and_save_txhash() {
    local src="$1"
    # Cari hash 0x + 64 hex, ambil terakhir bila ada beberapa
    local h=$(echo "$src" | grep -Eo '0x[a-fA-F0-9]{64}' | tail -n1)
    if [ -n "$h" ]; then
        echo "$h" > "$TXHASH_FILE"
    fi
}

while true; do
    clear
    echo "============================"
    echo "  NETRUM DUALITY SYSTEM"
    echo "============================"
    echo "1. Auto Claim 24 Jam + Sync 2 Jam Sekali"
    echo "2. Cek Balance"
    echo "3. Claim Reward"
    echo "4. Cek Status Node (Last 10 lines)"
    echo "0. Exit"
    echo "============================"
    read -p "Pilih menu: " choice

    case $choice in
        1)
            echo "🔄 Menjalankan Auto Claim + Sync loop..."
            while true; do
                TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
                CLAIM_LOG=$(cd "$NODE_DIR" && netrum-claim <<< "Y" 2>&1)

                # Simpan tx hash jika ada
                extract_and_save_txhash "$CLAIM_LOG"

                WALLET=$(grep ^WALLET "$NODE_DIR/.env" | cut -d '=' -f2)
                WALLETMASKED=$(echo "$WALLET" | sed 's/\(0x....\).*\(....\)/\1********\2/')
                BASE_NAME=$(node "$NODE_DIR/get-base-name.cjs" "$WALLET" 2>/dev/null || echo "No .base name")

                REPORT="⏱️ Waktu Claim: $TIMESTAMP
💳 Wallet: $WALLETMASKED
🔗 Base Name: $BASE_NAME
$CLAIM_LOG"
                send_log "Auto Claim - $TIMESTAMP" "$REPORT"

                # 2 jam sekali sync + kirim 10 baris log terakhir (INFO)
                for i in {1..12}; do
                    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
                    STATUS_LOG=$(journalctl -u netrum-node.service -n 10 --no-pager | grep -E '\[INFO\] (Sync successful|Mining token saved)')
                    send_log "Sync Node - $TIMESTAMP" "$STATUS_LOG"
                    sleep 2h
                done
            done
            ;;
        2)
            echo "💰 Cek Balance..."
            node "$NODE_DIR/balance-report.cjs"
            ;;
        3)
            TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
            CLAIM_LOG=$(cd "$NODE_DIR" && netrum-claim <<< "Y" 2>&1)

            # Simpan tx hash jika ada
            extract_and_save_txhash "$CLAIM_LOG"

            WALLET=$(grep ^WALLET "$NODE_DIR/.env" | cut -d '=' -f2)
            WALLETMASKED=$(echo "$WALLET" | sed 's/\(0x....\).*\(....\)/\1********\2/')
            BASE_NAME=$(node "$NODE_DIR/get-base-name.cjs" "$WALLET" 2>/dev/null || echo "No .base name")

            REPORT="⏱️ Waktu Claim: $TIMESTAMP
💳 Wallet: $WALLETMASKED
🔗 Base Name: $BASE_NAME
$CLAIM_LOG"
            send_log "Claim Reward - $TIMESTAMP" "$REPORT"
            ;;
        4)
            TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
            STATUS_LOG=$(journalctl -u netrum-node.service -n 10 --no-pager | grep -E '\[INFO\] (Sync successful|Mining token saved)')
            send_log "Status Node - $TIMESTAMP" "$STATUS_LOG"
            ;;
        0)
            echo "🚪 Keluar..."
            exit 0
            ;;
        *)
            echo "❌ Pilihan tidak valid."
            ;;
    esac

    read -p "Tekan Enter untuk kembali ke menu..."
done

