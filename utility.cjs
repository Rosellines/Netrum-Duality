function maskWallet(wallet) {
    if (!wallet || wallet.length < 10) return wallet;
    return wallet.slice(0, 6) + '********' + wallet.slice(-4);
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').split('.')[0];
}

module.exports = { maskWallet, getTimestamp };
