import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

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

export async function mintTokens(to: string, amount: bigint) {
  try {
    // First simulate the transaction
    const { request } = await publicClient.simulateContract({
      account,
      address: mintAddress,
      abi: mintABI,
      functionName: 'mint',
      args: [to, amount]
    });
    
    // If simulation succeeds, execute the actual transaction
    const hash = await walletClient.writeContract(request);
    return hash;
    // return '0x1234567890';
  } catch (error) {
    throw new Error(`Mint failed: ${error}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to } = body as { to: string };
    const hash = await mintTokens(to, parseEther('100'))
    return Response.json({ success: true, data: hash });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ success: false, data: errorMessage });
  }
}