"use client";
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [fetching, setFetching] = useState(false);
  const [txHash, setTxHash] = useState();
  const handleRequestTokens = async () => {
    setFetching(true);
    // TODO: Implement token request logic
    const res = await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: address }),
    });
    const data = await res.json();
    setTxHash(data.data);

    setFetching(false);
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-xl">
        {txHash && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
            <p className="text-green-300 text-sm break-all">
              Transaction Hash:{" "}
              <a href={`https://testnet.bscscan.com/tx/${txHash}`}>{txHash}</a>
            </p>
          </div>
        )}
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Token Faucet
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Get bsc test tokens for development
        </p>

        <div className="space-y-6">
          <div>
            <input
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Enter your wallet address"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <button
            disabled={fetching || !address}
            onClick={handleRequestTokens}
            className={`w-full text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              fetching || !address
                ? "bg-purple-400 cursor-not-allowed opacity-60"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <span>{!fetching ? `Request Tokens` : `Requesting...`}</span>
            {/* <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg> */}
          </button>
        </div>
      </div>

      {/* <a href="#" className="mt-8 text-gray-400 hover:text-white transition">
        Join our Discord community →
      </a> */}
    </main>
  );
}
