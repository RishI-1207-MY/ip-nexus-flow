
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const { activeAddress, disconnect: walletDisconnect, activeAccount, providers } = useWallet();
  
  const [state, setState] = useState<AlgorandState>({
    connected: !!activeAddress,
    address: activeAddress || null,
    loading: false,
    error: null,
  });

  // Update state when wallet connection changes
  useEffect(() => {
    setState({
      connected: !!activeAddress,
      address: activeAddress || null,
      loading: false,
      error: null,
    });
  }, [activeAddress]);

  const connectWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // The actual connection will be handled by ConnectWallet component
      // This function can be used to show the modal
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
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      if (activeAccount && walletDisconnect) {
        await walletDisconnect();
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
  }, [activeAccount, walletDisconnect]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
  };
};

export default useAlgorand;
