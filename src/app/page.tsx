"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [fetching, setFetching] = useState(false);
  const [txHash, setTxHash] = useState<
    { hash?: string; ethHash?: string } | undefined
  >(undefined);
  const [error, setError] = useState();
  const [commitHash, setCommitHash] = useState("");

  const handleRequestTokens = async () => {
    setFetching(true);
    const res = await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: address }),
    });
    const data = await res.json();
    if(!data.success) {
      setError(data.data);
    } else {
      setTxHash(data.data);
    }

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
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg p-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a
            href="https://github.com/rexdavinci/bsc-testnet-token-faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition flex items-center gap-2"
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
          <a
            href={`https://github.com/rexdavinci/bsc-testnet-token-faucet/commit/${commitHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 font-mono text-sm"
          >
            {(commitHash && `version: ${commitHash.slice(0, 8)}`) || ""}
          </a>
        </div>
      </nav>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-lg border border-gray-700">
          {txHash && (
            <>
              <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm break-all">
                  BNB:{" "}
                  <a href={`https://testnet.bscscan.com/tx/${txHash.hash}`} className="text-amber-400 hover:text-amber-300">
                    {txHash.hash}
                  </a>
                </p>
              </div>
              <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm break-all">
                  Token:{" "}
                  <a href={`https://testnet.bscscan.com/tx/${txHash!.ethHash}`} className="text-amber-400 hover:text-amber-300">
                    {txHash.ethHash}
                  </a>
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm break-all">
                {error}
              </p>
            </div>
          )}
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-2 text-center">
            BNB & Token Faucet
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
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
            <button
              disabled={fetching || !address}
              onClick={handleRequestTokens}
              className={`w-full font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                fetching || !address
                  ? "bg-gradient-to-r from-amber-700 to-amber-600 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-gray-900"
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
