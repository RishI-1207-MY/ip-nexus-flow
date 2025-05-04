
import { useWallet } from '@txnlab/use-wallet-react';
import { useState, useEffect } from 'react';
import algosdk from 'algosdk';

const Account = () => {
  const { activeAddress, activeAccount, algodClient } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (activeAddress && algodClient) {
        try {
          const accountInfo = await algodClient.accountInformation(activeAddress).do();
          setBalance(accountInfo.amount / 1000000); // Convert microAlgos to Algos
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      }
    };

    fetchBalance();
  }, [activeAddress, algodClient]);

  if (!activeAddress) {
    return null;
  }

  return (
    <div className="p-2 rounded-lg bg-muted">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Connected:</span>
          <span className="text-sm font-bold">{activeAccount?.providerId || 'Unknown Wallet'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Address:</span>
          <span className="text-xs truncate max-w-[180px]">{activeAddress}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Balance:</span>
          <span className="text-sm">{balance !== null ? `${balance.toFixed(2)} ALGO` : 'Loading...'}</span>
        </div>
      </div>
    </div>
  );
};

export default Account;
