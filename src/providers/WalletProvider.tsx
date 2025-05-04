
import { ReactNode } from 'react';
import { WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
import { DeflyWallet } from '@blockshake/defly-connect';
import { PeraWallet } from '@perawallet/connect';
import { DaffiWallet } from '@daffiwallet/connect';
import { AlgorandClient } from '@algorandfoundation/algokit-utils/types/algorand-client';
import algosdk from 'algosdk';

// Create wallet connection instances
const peraPrime = (pera: PeraWallet) => () => pera.connect();
const deflyPrime = (defly: DeflyWallet) => () => defly.connect();
const daffiPrime = (daffi: DaffiWallet) => () => daffi.connect();

// Create the client
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodToken = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const pera = new PeraWallet();
  const defly = new DeflyWallet();
  const daffi = new DaffiWallet();

  const wallets = [
    {
      id: 'pera',
      name: 'Pera Wallet',
      wallet: pera,
      connect: peraPrime(pera),
      metadata: {
        name: 'Pera Wallet',
        icon: 'https://perawallet.app/static/logo-512.png',
      }
    },
    {
      id: 'defly',
      name: 'Defly Wallet',
      wallet: defly,
      connect: deflyPrime(defly),
      metadata: {
        name: 'Defly Wallet',
        icon: 'https://defly.app/assets/img/favicon/apple-touch-icon.png',
      }
    },
    {
      id: 'daffi',
      name: 'Daffi Wallet',
      wallet: daffi,
      connect: daffiPrime(daffi),
      metadata: {
        name: 'Daffi Wallet',
        icon: 'https://daffiwallet.io/static/icon-512x512-8a94027b32555f9edc584afc3c8b2015.png',
      }
    }
  ];

  return (
    <UseWalletProvider
      value={{
        wallets,
        algodClient,
        network: 'testnet',
      }}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
