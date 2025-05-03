
import { useState, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAccount, isReady } = useWallet();
  
  // Use the wallet connection state from @txnlab/use-wallet-react
  const state: AlgorandState = {
    connected: !!activeAccount,
    address: activeAccount?.address || null,
    loading: !isReady || loading,
    error: null,
  };

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      
      // Connection is handled by the ConnectWallet component
      // This is just a placeholder to maintain API compatibility
      toast.info("Please select a wallet provider from the modal");
      
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet', {
        description: error.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    // Actual disconnection is handled in the ConnectWallet component
    // This is just a placeholder to maintain API compatibility
    toast.success('Wallet disconnected');
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
  };
};
