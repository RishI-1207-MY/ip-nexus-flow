
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const { activeAccount, connect, disconnect, isConnected, isLoading } = useWallet();
  
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
      
      // This will trigger the wallet connect UI
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
      if (activeAccount) {
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
  }, [activeAccount, disconnect]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    loading: isLoading || state.loading
  };
};

export default useAlgorand;
