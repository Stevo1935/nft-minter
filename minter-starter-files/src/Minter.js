import React, { useState } from 'react';
import { ethers } from 'ethers';

function Minter() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');

  const CONTRACT_ADDRESS = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // Public test contract
  const ABI = [
    "function mint(address to) public payable",
    "function balanceOf(address owner) view returns (uint256)"
  ];

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setStatus('Wallet connected!');
      } catch (err) {
        setStatus('User rejected request');
      }
    } else {
      setStatus('Install MetaMask!');
    }
  };

  const mintNFT = async () => {
    if (!account) return alert("Connect wallet first!");

    try {
      setStatus('Minting...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.mint(account, {
        value: ethers.utils.parseEther("0.001")
      });

      await tx.wait();
      setStatus(`Minted! Tx: ${tx.hash}`);
    } catch (err) {
      setStatus('Mint failed: ' + err.message);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
          NFT Minter
        </h1>
        <p className="text-gray-300 mt-2">Mint on Sepolia Testnet</p>
      </div>

      {/* Wallet Connect */}
      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition transform flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.4 2L2 12.2l9.4 1.3L21 3.2zM2 13.8l9.4 7.4 9.4-12.6z"/>
          </svg>
          Connect MetaMask
        </button>
      ) : (
        <>
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-400">Connected</p>
            <p className="font-mono text-lg break-all">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>

          {/* Mint Button */}
          <button
            onClick={mintNFT}
            disabled={status.includes('Minting')}
            className={`w-full py-5 px-6 rounded-xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-3
              ${status.includes('Minting') 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:scale-105'
              }`}
          >
            {status.includes('Minting') ? (
              <>⏳ Minting...</>
            ) : (
              <>Mint NFT (0.001 ETH)</>
            )}
          </button>
        </>
      )}

      {/* Status */}
      {status && (
        <div className={`mt-6 p-4 rounded-lg text-center font-mono text-sm
          ${status.includes('Minted') ? 'bg-green-900/50 text-green-300' : 
            status.includes('failed') ? 'bg-red-900/50 text-red-300' : 
            'bg-blue-900/50 text-blue-300'}
        `}>
          {status.includes('Minted') ? (
            <>
              Success! 
              <a href={`https://sepolia.etherscan.io/tx/${status.split('Tx: ')[1]}`} target="_blank" className="underline ml-1">
                View Tx
              </a>
            </>
          ) : status}
        </div>
      )}
    </div>
  </div>
);
}

export default Minter;
