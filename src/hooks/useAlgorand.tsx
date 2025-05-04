
import { useState, useEffect, useCallback } from 'react';
import { AlgorandState } from '@/types';
import { toast } from 'sonner';

export const useAlgorand = () => {
  const [state, setState] = useState<AlgorandState>({
    connected: false,
    address: null,
    loading: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // This is a mockup that would be replaced with actual Algorand wallet connection
      // In a real app, we would use PeraWallet or another Algorand wallet connector
      setTimeout(() => {
        const mockAddress = 'ALGO' + Math.random().toString(36).substring(2, 15).toUpperCase();
        setState({
          connected: true,
          address: mockAddress,
          loading: false,
          error: null,
        });
        toast.success("Wallet connected successfully", {
          description: `Connected to address ${mockAddress.substring(0, 10)}...`,
        });
      }, 1000);
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

  const disconnectWallet = useCallback(() => {
    setState({
      connected: false,
      address: null,
      loading: false,
      error: null,
    });
    toast.success('Wallet disconnected');
  }, []);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    // In a real app, we'd check localStorage or the wallet SDK
    // This is a mockup for demonstration
    const checkWalletConnection = async () => {
      try {
        // Mock wallet check
        const connected = false; // default to not connected
        if (connected) {
          connectWallet();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, [connectWallet]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
  };
};
