#!/bin/bash

NODE_DIR="/root/netrum-lite-node/Netrum-Duality"
SEND_REPORT="$NODE_DIR/send-report.cjs"
TXHASH_FILE="$NODE_DIR/last_tx_hash.txt"

# Simpan tx hash terakhir
extract_and_save_txhash() {
    local src="$1"
    local h=$(echo "$src" | grep -Eo '0x[a-fA-F0-9]{64}' | tail -n1)
    if [ -n "$h" ]; then
        echo "$h" > "$TXHASH_FILE"
    fi
}

# Generate report dalam format JSON
generate_report() {
    local CLAIM_LOG="$1"
    local TIMESTAMP="$2"

    WALLET=$(grep ^WALLET "$NODE_DIR/.env" | cut -d '=' -f2)
    BASE_NAME=$(node "$NODE_DIR/get-base-name.cjs" "$WALLET" 2>/dev/null || echo "No .base name")
    NPT_BALANCE=$(node "$NODE_DIR/balance-report.cjs" | grep -Eo '[0-9]+\.[0-9]+ NPT' | awk '{print $1}')
    ETH_BALANCE=$(node "$NODE_DIR/balance-report.cjs" | grep -Eo '[0-9]+\.[0-9]+ ETH' | awk '{print $1}')

    echo "{\"baseName\":\"$BASE_NAME\",\"nptBalance\":\"${NPT_BALANCE} NPT\",\"ethBalance\":\"${ETH_BALANCE} ETH\"}"
}

send_log() {
    local title="$1"
    local json="$2"
    echo "$json" | node "$SEND_REPORT" "$title"
}

# Menu utama
while true; do
    clear
    echo "============================"
    echo "  NETRUM DUALITY SYSTEM"
    echo "============================"
    echo "1. Auto Claim 24 Jam + Sync 2 Jam Sekali"
    echo "2. Cek Balance"
    echo "3. Claim Reward"
    echo "4. Cek Status Node"
    echo "0. Exit"
    echo "============================"
    read -p "Pilih menu: " choice

    case $choice in
        1)
            echo "🔄 Menjalankan Auto Claim + Sync loop..."
            while true; do
                TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
                CLAIM_LOG=$(cd "$NODE_DIR" && netrum-claim <<< "Y" 2>&1)
                extract_and_save_txhash "$CLAIM_LOG"

                REPORT=$(generate_report "$CLAIM_LOG" "$TIMESTAMP")
                send_log "Auto Claim - $TIMESTAMP" "$REPORT"

                for i in {1..12}; do
                    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
                    REPORT=$(generate_report "" "$TIMESTAMP")
                    send_log "Sync Node - $TIMESTAMP" "$REPORT"
                    sleep 2h
                done
            done
            ;;
        2)
            REPORT=$(generate_report "" "$(date '+%Y-%m-%d %H:%M:%S')")
            send_log "Cek Balance" "$REPORT"
            ;;
        3)
            TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
            CLAIM_LOG=$(cd "$NODE_DIR" && netrum-claim <<< "Y" 2>&1)
            extract_and_save_txhash "$CLAIM_LOG"
            REPORT=$(generate_report "$CLAIM_LOG" "$TIMESTAMP")
            send_log "Claim Reward - $TIMESTAMP" "$REPORT"
            ;;
        4)
            REPORT=$(generate_report "" "$(date '+%Y-%m-%d %H:%M:%S')")
            send_log "Status Node" "$REPORT"
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
