
import { useWallet } from '@txnlab/use-wallet-react';
import { useState, useEffect } from 'react';

const Account = () => {
  const { activeAccount, algodClient } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (activeAccount?.address && algodClient) {
        try {
          const accountInfo = await algodClient.accountInformation(activeAccount.address).do();
          // Convert microAlgos to Algos (handle both number and bigint types)
          const amount = typeof accountInfo.amount === 'bigint' 
            ? Number(accountInfo.amount) / 1000000 
            : accountInfo.amount / 1000000;
          setBalance(amount);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [activeAccount, algodClient]);

  if (!activeAccount?.address) {
    return null;
  }

  return (
    <div className="p-2 rounded-lg bg-muted">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Connected:</span>
          <span className="text-sm font-bold">{activeAccount.name || 'Unknown Wallet'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Address:</span>
          <span className="text-xs truncate max-w-[180px]">{activeAccount.address}</span>
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
