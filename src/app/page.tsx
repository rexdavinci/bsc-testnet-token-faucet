"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [fetching, setFetching] = useState(false);
  const [txHash, setTxHash] = useState();
  const [amount, setAmount] = useState("");
  const [commitHash, setCommitHash] = useState("");

  const handleRequestTokens = async () => {
    setFetching(true);
    const res = await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: address, amount }),
    });
    const data = await res.json();
    setTxHash(data.data);

    setFetching(false);
  };

  useEffect(() => {
    fetch("/api/mint", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setCommitHash(res.data);
        }
      });
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a
            href="https://github.com/rexdavinci/bsc-testnet-token-faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-purple-300 transition flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                clipRule="evenodd"
              />
            </svg>
            Source Code
          </a>
          <a href={`https://github.com/rexdavinci/bsc-testnet-token-faucet/commit/${commitHash}`} target="_blank"
            rel="noopener noreferrer" className="text-gray-400 font-mono text-sm">
            {/* {commitHash && `version: commit${commitHash.slice(4)}` || ""} */}
            {commitHash && `version: ${commitHash.slice(0, 8)}` || ""}
          </a>
        </div>
      </nav>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex flex-col items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-xl">
          {txHash && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
              <p className="text-green-300 text-sm break-all">
                Transaction Hash:{" "}
                <a href={`https://testnet.bscscan.com/tx/${txHash}`}>
                  {txHash}
                </a>
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
            <div>
              <input
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount of tokens"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                min="0"
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
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
