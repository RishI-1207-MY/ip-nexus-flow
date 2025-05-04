
import { useState, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAccount, setActiveProvider, activeProvider } = useWallet();
  
  // Use the wallet connection state from @txnlab/use-wallet-react
  const state: AlgorandState = {
    connected: !!activeAccount,
    address: activeAccount?.address || null,
    loading,
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

  const disconnectWallet = useCallback(async () => {
    try {
      if (activeProvider) {
        await activeProvider.disconnect();
        toast.success('Wallet disconnected');
      }
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [activeProvider]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
  };
};
