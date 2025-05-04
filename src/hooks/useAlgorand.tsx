
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const { activeAccount, connectedAccounts, isReady, isActive, connect, disconnect } = useWallet();
  
  const [state, setState] = useState<AlgorandState>({
    connected: !!activeAccount,
    address: activeAccount?.address || null,
    loading: false,
    error: null,
  });

  // Update state when wallet connection changes
  useEffect(() => {
    setState({
      connected: !!activeAccount,
      address: activeAccount?.address || null,
      loading: false,
      error: null,
    });
  }, [activeAccount]);

  const connectWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // This will open modal for selecting a wallet provider
      await connect();
      
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to connect wallet',
      }));
      toast.error('Failed to connect wallet', {
        description: error.message || 'Please try again',
      });
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (isActive) {
        await disconnect();
      }
      
      setState({
        connected: false,
        address: null,
        loading: false,
        error: null,
      });
      
      toast.success('Wallet disconnected');
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet', {
        description: error.message || 'Please try again',
      });
    }
  }, [isActive, disconnect]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    loading: !isReady || state.loading,
    connectedAccounts
  };
};

export default useAlgorand;
