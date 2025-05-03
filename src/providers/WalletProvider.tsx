
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

// Create wallet connection instances
const pera = new PeraWalletConnect();
const defly = new DeflyWalletConnect();
const daffi = new DaffiWalletConnect();

// Create Algorand client
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodToken = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Map wallet providers
const wallets = [
  { id: 'pera-wallet', wallet: pera, name: 'Pera Wallet' },
  { id: 'defly-wallet', wallet: defly, name: 'Defly Wallet' },
  { id: 'daffi-wallet', wallet: daffi, name: 'Daffi Wallet' }
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
      wallets={wallets}
      algodClient={algodClient}
      network={'testnet'}
    >
      {children}
    </UseWalletProvider>
  );
}
