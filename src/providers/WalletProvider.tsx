
import { ReactNode } from 'react';
import { WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import algosdk from 'algosdk';

// Create the client
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodToken = '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const pera = new PeraWalletConnect();
  const defly = new DeflyWalletConnect();
  const daffi = new DaffiWalletConnect();

  const wallets = [
    {
      id: 'pera',
      name: 'Pera Wallet',
      wallet: pera,
      metadata: {
        name: 'Pera Wallet',
        icon: 'https://perawallet.app/static/logo-512.png',
      }
    },
    {
      id: 'defly',
      name: 'Defly Wallet',
      wallet: defly,
      metadata: {
        name: 'Defly Wallet',
        icon: 'https://defly.app/assets/img/favicon/apple-touch-icon.png',
      }
    },
    {
      id: 'daffi',
      name: 'Daffi Wallet',
      wallet: daffi,
      metadata: {
        name: 'Daffi Wallet',
        icon: 'https://daffiwallet.io/static/icon-512x512-8a94027b32555f9edc584afc3c8b2015.png',
      }
    }
  ];

  return (
    <UseWalletProvider
      wallets={wallets}
      algodClient={algodClient}
      network="testnet"
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
