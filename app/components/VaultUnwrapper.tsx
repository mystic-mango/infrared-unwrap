'use client';

import { useState, useEffect } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract,
  useChainId,
  useSwitchChain
} from 'wagmi';
import { berachain } from 'wagmi/chains';
import wivAbi from '../abis/wiv.json';

// Predefined WIV contracts
const WIV_CONTRACTS = [
  { address: '0xb38b0D08965654f11377c0C90F2338D63926C9B9', name: 'wiv-KODI WETH-STONE' },
  { address: '0x47590f8c83bb99ff9C9d6640F007722A79f0Ab02', name: 'wiv-KODI beraETH-rswETH' },
  { address: '0x57684b647D4Cc6b151E7476355fcFdc174da7ECE', name: 'wiv-KODI WETH-HONEY' },
  { address: '0x58b34E79D53CAcbbC9920477c5BeA55A832871fD', name: 'wiv-KODI WETH-beraETH' },
  { address: '0x7e312939980B2842B524D3418Aa9b7498054e39a', name: 'wiv-KODI WBTC-WETH' },
];

export default function VaultUnwrapper() {
  const [wivAddress, setWivAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: writeData, isPending, isSuccess, writeContractAsync } = useWriteContract();

  // Get the WIV balance of the connected wallet
  const { data: balance, isError: isBalanceError, error: balanceError, isLoading, refetch } = useReadContract({
    address: isConnected && wivAddress ? (wivAddress as `0x${string}`) : undefined,
    abi: wivAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: berachain.id,
  });

  // Check if we're on the correct chain
  const isOnBerachain = chainId === berachain.id;

  // Log contract read details whenever relevant values change
  useEffect(() => {
    console.log('Contract Read State:', {
      isConnected,
      wivAddress,
      userAddress: address,
      balance,
      isLoading,
      isError: isBalanceError,
      error: balanceError,
      chainId,
      isOnBerachain,
      readConfig: {
        address: isConnected && wivAddress ? (wivAddress as `0x${string}`) : undefined,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: berachain.id,
      }
    });
  }, [isConnected, wivAddress, address, balance, isLoading, isBalanceError, balanceError, chainId, isOnBerachain]);

  // Helper to check if balance exists and is non-zero
  const hasBalance = Boolean(balance && typeof balance === 'bigint' && balance > BigInt(0));

  const handleUnwrap = async () => {
    if (!address || !wivAddress || !hasBalance) return;
    
    try {
      setError(null);
      
      // Ensure we're on Berachain before proceeding
      if (!isOnBerachain) {
        console.log('Switching to Berachain...');
        await switchChain({ chainId: berachain.id });
        return; // The function will be called again after the chain switch
      }

      console.log('Attempting to unwrap with params:', {
        address: wivAddress,
        balance,
        userAddress: address,
        chainId
      });

      await writeContractAsync({
        address: wivAddress as `0x${string}`,
        abi: wivAbi,
        functionName: 'redeem',
        args: [balance as bigint, address, address],
        chainId: berachain.id,
      });
    } catch (error: any) {
      console.error('Error unwrapping vault:', error);
      // Extract and format the error message for better user understanding
      let errorMessage = 'Failed to unwrap vault. ';
      
      if (error?.message?.includes('chain')) {
        errorMessage += 'Please switch to Berachain network to continue.';
      } else if (error?.message) {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleSelectContract = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWivAddress(e.target.value);
    setError(null); // Clear any previous errors when selecting a new contract
  };

  // Format the balance for display
  const formattedBalance = hasBalance 
    ? ((balance as bigint) / BigInt(10**18)).toString() + '.' + ((balance as bigint) % BigInt(10**18)).toString().padStart(18, '0').slice(0, 6)
    : '0';

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Infrared Vault Unwrapper</h2>
      
      <div className="mb-6 p-4 bg-gray-700 rounded-md border border-gray-600">
        <h3 className="font-bold text-blue-300 mb-2">ℹ️ About This Tool</h3>
        <p className="text-gray-300 text-sm mb-2">
          This tool was created for the Berachain community to help users who deposited into 
          wrapped Infrared vaults (WIV) through Boyco yield opportunities.
        </p>
        <p className="text-gray-300 text-sm mb-3">
          When withdrawals were unlocked, many users needed to make direct contract calls to 
          unwrap their positions. This simple interface allows you to safely unwrap your WIV 
          tokens without making manual contract calls.
        </p>
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-300">
            This is an open source tool. 
            <a 
              href="https://github.com/mystic-mango/infrared-unwrap" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 ml-1"
            >
              View the code on GitHub
            </a>
            {' '}to verify it's safe.
          </span>
        </div>
      </div>
      
      {!isOnBerachain && isConnected && (
        <div className="mb-4 p-4 bg-red-800 text-white rounded-md border border-red-600">
          <h3 className="font-bold mb-2">⚠️ Wrong Network</h3>
          <p className="mb-3">You are currently on the wrong network. This app requires Berachain network.</p>
          <button
            onClick={() => switchChain({ chainId: berachain.id })}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Switch to Berachain
          </button>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="wivAddress" className="block text-sm font-medium text-gray-300 mb-2">
          Select WIV Contract
        </label>
        <select
          id="wivAddress"
          value={wivAddress}
          onChange={handleSelectContract}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a WIV contract...</option>
          {WIV_CONTRACTS.map((contract) => (
            <option key={contract.address} value={contract.address}>
              {contract.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="customAddress" className="block text-sm font-medium text-gray-300 mb-2">
          Or enter custom WIV address
        </label>
        <input
          id="customAddress"
          type="text"
          placeholder="0x..."
          value={wivAddress}
          onChange={(e) => {
            setWivAddress(e.target.value);
            setError(null); // Clear any previous errors when entering a new address
          }}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isConnected && wivAddress && (
        <div className="mb-4 p-3 bg-gray-700 rounded-md">
          <p className="text-sm text-gray-300">Your WIV Balance:</p>
          <p className="text-lg font-medium text-white">
            {isLoading ? 'Loading...' : 
             isBalanceError ? `Error: ${balanceError?.message}` :
             hasBalance ? formattedBalance : 'No balance'}
          </p>
          {isBalanceError && (
            <div className="mt-2">
              <p className="text-sm text-red-400">
                Failed to fetch balance. Please check the console for details.
              </p>
              <button 
                onClick={() => refetch()}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {isConnected && wivAddress && hasBalance && (
        <div className="mb-4 p-4 bg-gray-700 rounded-md border border-gray-600">
          <h3 className="font-bold text-white mb-2">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              You are about to unwrap <span className="text-white font-medium">{formattedBalance} WIV</span> shares
            </p>
            <p className="text-gray-300">
              From contract: <span className="text-white font-mono break-all">{wivAddress}</span>
            </p>
            <p className="text-gray-300">
              To your address: <span className="text-white font-mono break-all">{address}</span>
            </p>
            <p className="text-gray-300">
              They are LP tokens, representing your LP position in the associated (Kodiak) pool.
            </p>
            <div className="mt-3 p-3 bg-gray-800 rounded">
              <p className="text-gray-300 mb-2">Contract call:</p>
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                {`function: redeem(uint256 shares, address receiver, address owner)
args: [
  ${(balance as bigint).toString()}, // shares
  "${address}", // receiver
  "${address}"  // owner
]`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-800 text-white rounded-md border border-red-600">
          <h3 className="font-bold mb-2">⚠️ Error</h3>
          <p>{error}</p>
          {error.includes('Berachain') && (
            <button
              onClick={() => switchChain({ chainId: berachain.id })}
              className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Switch to Berachain
            </button>
          )}
        </div>
      )}

      <button
        onClick={handleUnwrap}
        disabled={!isConnected || !wivAddress || !hasBalance || isPending || !isOnBerachain}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Unwrapping...' : 'Unwrap Vault'}
      </button>

      {!isConnected && (
        <p className="mt-4 text-center text-sm text-gray-400">
          Please connect your wallet first
        </p>
      )}

      {isSuccess && (
        <div className="mt-4 p-4 bg-green-800 text-green-100 rounded-md border border-green-600">
          <h3 className="font-bold mb-2">✅ Success!</h3>
          <p>Successfully unwrapped your vault!</p>
          {writeData && (
            <a 
              href={`https://artio.beratrail.io/tx/${writeData}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block text-green-300 hover:underline"
            >
              View on explorer
            </a>
          )}
        </div>
      )}
    </div>
  );
} 