
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@txnlab/use-wallet-react';

export const useAlgorand = () => {
  // Updated to use current API
  const { activeAccount, wallets, isReady, setActiveAccount, signTransactions } = useWallet();
  
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
      
      // In the updated API, there's no single connect method
      // Instead, we need to add a UI to let users choose a wallet
      // We'll just show a toast message for now
      toast.info('Please choose a wallet to connect with', {
        description: 'The wallet selection UI needs to be implemented.',
        action: {
          label: 'Got it',
          onClick: () => {},
        },
      });
      
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
        // Set active account to null to disconnect
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
  }, [activeAccount, setActiveAccount]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    loading: !isReady || state.loading,
    // Provide the wallets array instead of connectedAccounts
    connectedAccounts: wallets.map(wallet => wallet.accounts).flat() || []
  };
};

export default useAlgorand;
