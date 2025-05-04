
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

  const pera = new PeraWalletConnect();
  const defly = new DeflyWalletConnect();
  const daffi = new DaffiWalletConnect();
  
  return (
    <UseWalletProvider
      value={{
        wallets: [
          { name: 'Pera Wallet', connector: pera },
          { name: 'Defly Wallet', connector: defly },
          { name: 'Daffi Wallet', connector: daffi }
        ],
        algodClient
      }}
    >
      {children}
    </UseWalletProvider>
  );
}
