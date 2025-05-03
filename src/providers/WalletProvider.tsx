
import { PropsWithChildren, useEffect, useState } from 'react';
import { WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import algosdk from 'algosdk';

// Polyfill for 'global' object that WalletConnect expects in browser environment
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
}

// Create Algorand client
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodToken = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Create wallet connection instances
const pera = new PeraWalletConnect();
const defly = new DeflyWalletConnect();
const daffi = new DaffiWalletConnect();

// Define providers for @txnlab/use-wallet-react v4
const providers = [
  { id: 'pera-wallet', name: 'Pera Wallet', icon: 'https://perawallet.app/favicon.ico', provider: pera },
  { id: 'defly-wallet', name: 'Defly Wallet', icon: 'https://defly.app/favicon.ico', provider: defly },
  { id: 'daffi-wallet', name: 'Daffi Wallet', icon: 'https://daffi.me/favicon.ico', provider: daffi }
];

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
      providers={providers}
      nodeConfig={{ network: 'testnet', nodeServer: algodServer, nodeToken: algodToken, nodePort: algodPort }}
    >
      {children}
    </UseWalletProvider>
  );
}
