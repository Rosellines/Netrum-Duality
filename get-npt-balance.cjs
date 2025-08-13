#!/usr/bin/env node
require('dotenv').config();
const { ethers } = require('ethers');
const ERC20ABI = require('./erc20-abi.cjs');

// ➜ Pakai BASE RPC (NPT token + .base name ada di Base)
const BASE_RPC = process.env.BASE_RPC || "https://mainnet.base.org";
const provider = new ethers.JsonRpcProvider(BASE_RPC);

// NPT contract di Base (sesuai yang terbukti jalan)
const NPT_CONTRACT = process.env.NPT_CONTRACT || "0xb8c2ce84f831175136cebbfd48ce4bab9c7a6424";

// Reverse resolver .base (Base chain)
const REVERSE_REGISTRAR = "0x79ea96012eea67a83431f1701b3dff7e37f9e282";
const RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

const REV_ABI = ["function node(address addr) view returns (bytes32)"];
const RESOLVER_ABI = ["function name(bytes32 node) view returns (string)"];

async function getNPTBalance(address) {
  try {
    const contract = new ethers.Contract(NPT_CONTRACT, ERC20ABI, provider);
    const balance = await contract.balanceOf(address);
    return parseFloat(ethers.formatEther(balance)).toFixed(4);
  } catch (err) {
    return "0.0000";
  }
}

async function getBaseUsername(address) {
  try {
    const reverse = new ethers.Contract(REVERSE_REGISTRAR, REV_ABI, provider);
    const node = await reverse.node(address);
    const resolver = new ethers.Contract(RESOLVER, RESOLVER_ABI, provider);
    const name = await resolver.name(node);
    return name || "No .base name";
  } catch (err) {
    return "No .base name";
  }
}

async function getETHBalance(address) {
  try {
    const wei = await provider.getBalance(address);
    return parseFloat(ethers.formatEther(wei)).toFixed(6);
  } catch (err) {
    return "0.000000";
  }
}

async function getWalletReport(address) {
  const [balance, baseName] = await Promise.all([
    getNPTBalance(address),
    getBaseUsername(address),
  ]);
  return { balance, baseName, address };
}

module.exports = { getNPTBalance, getBaseUsername, getWalletReport, getETHBalance };

