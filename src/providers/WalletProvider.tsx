
import { PropsWithChildren, useEffect, useState } from 'react';
import { WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';

// Polyfill for 'global' object that WalletConnect expects in browser environment
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
}

// Create wallet connection instances
const pera = new PeraWalletConnect();
const defly = new DeflyWalletConnect();
const daffi = new DaffiWalletConnect();

// Map of wallet connection providers to implement
// @txnlab/use-wallet-react v4 requires 'wallets' instead of 'providers'
const walletProviders = {
  pera,
  defly,
  daffi
};

export function WalletProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for document to be fully loaded
    if (document.readyState === 'complete') {
      setIsReady(true);
    } else {
      window.addEventListener('load', () => setIsReady(true));
      return () => window.removeEventListener('load', () => setIsReady(true));
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <UseWalletProvider
      wallets={walletProviders}
      nodeConfig={{ 
        network: 'testnet', // Change to 'mainnet' for production
        nodeServer: 'https://testnet-api.algonode.cloud', // Use appropriate endpoint 
        nodeToken: '', // Add API token if needed
        nodePort: '',
        nodeHeaders: {}
      }}
    >
      {children}
    </UseWalletProvider>
  );
}
