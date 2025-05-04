
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  const { activeAccount, setActiveAccount, wallets, isReady } = useWallet();
  
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
      
      // Find available active wallets
      const availableWallet = wallets.find(wallet => wallet.isActive);
      
      if (availableWallet) {
        // This will trigger the wallet's connection UI
        const accounts = await availableWallet.connect();
        
        if (accounts && accounts.length > 0) {
          setActiveAccount(accounts[0]);
        }
      } else {
        throw new Error('No wallet provider is available');
      }
      
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
  }, [wallets, setActiveAccount]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (activeAccount) {
        const activeWallet = wallets.find(
          wallet => wallet.accounts.some(acc => acc.address === activeAccount.address)
        );
        
        if (activeWallet) {
          await activeWallet.disconnect();
        }
        
        setActiveAccount(null);
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
  }, [activeAccount, wallets, setActiveAccount]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    loading: !isReady || state.loading
  };
};

export default useAlgorand;
