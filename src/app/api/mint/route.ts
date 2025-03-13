import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import gitHash from 'child_process'



// // Replace with your private key
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// Create account from private key
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

// Create wallet client
const walletClient = createWalletClient({
  account,
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

const mintAddress = '0x6cF86307dA06b069Fa47A96268bc81a4D62031b5';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

const mintABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

async function mintTokens(to: string, amount: bigint) {
  try {
    // First simulate the transaction
    const { request } = await publicClient.simulateContract({
      account,
      address: mintAddress,
      abi: mintABI,
      functionName: 'mint',
      args: [to, amount]
    });

    // Optional: Transfer some ETH to the recipient address
    const ethHash = await walletClient.sendTransaction({
      to: to as `0x${string}`,
      value: parseEther('0.001') // Sending a small amount of BNB (BSC's native token)
    });

    // If simulation succeeds, execute the actual transaction
    const hash = await walletClient.writeContract(request);
    return { hash, ethHash };
  } catch (error) {
    throw new Error(`Mint failed: ${error}`);
  }
}

// Keep a set of addresses that have already received tokens
const mintedAddresses = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, amount } = body as { to: string; amount: string };

    // Check if this address has already received tokens
    if (mintedAddresses.has(to.toLowerCase())) {
      return Response.json({
        success: false,
        data: "This address has already received tokens"
      });
    }
    const hash = await mintTokens(to, parseEther(amount));
    // Add the address to the set of minted addresses
    mintedAddresses.add(to.toLowerCase());
    return Response.json({ success: true, data: hash });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ success: false, data: errorMessage });
  }
}


export async function GET() {
  try {
    const res = gitHash.execSync('git rev-parse HEAD')
      .toString()
      .trim();
    return Response.json({ success: true, data: res });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get git hash';
    return Response.json({ success: false, data: errorMessage });
  }
}


