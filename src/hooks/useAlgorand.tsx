
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const { activeAccount, isConnecting } = useWallet();
  
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
      
      // The actual connection will be handled by the wallet UI
      // This function is mainly used to show a connect modal if needed
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
      if (activeAccount) {
        // The disconnect method may vary based on the wallet implementation
        // For most wallets in @txnlab/use-wallet-react, just calling disconnect() should work
        if (typeof activeAccount.disconnect === 'function') {
          await activeAccount.disconnect();
        } else if (activeAccount.wallet && typeof activeAccount.wallet.disconnect === 'function') {
          await activeAccount.wallet.disconnect();
        }
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
  }, [activeAccount]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    loading: isConnecting || state.loading
  };
};

export default useAlgorand;
