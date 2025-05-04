
import { PropsWithChildren, useEffect, useState } from 'react';
import { PROVIDER_ID, WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
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
      id="wallet-provider"
      name="IP Nexus"
      providers={[
        { id: PROVIDER_ID.PERA, clientStatic: pera },
        { id: PROVIDER_ID.DEFLY, clientStatic: defly },
        { id: PROVIDER_ID.DAFFI, clientStatic: daffi }
      ]}
      nodeConfig={{
        network: 'testnet',
        nodeServer: algodServer,
        nodeToken: algodToken,
        nodePort: algodPort,
      }}
      algosdkStatic={algosdk}
    >
      {children}
    </UseWalletProvider>
  );
}
