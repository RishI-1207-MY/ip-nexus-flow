
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
  // Create wallet instances
  const pera = new PeraWalletConnect();
  const defly = new DeflyWalletConnect();
  const daffi = new DaffiWalletConnect();

  // Configure wallets with metadata 
  const walletProviders = [
    { id: 'pera', name: 'Pera', wallet: pera, metadata: { name: 'Pera', icon: 'https://perawallet.app/favicon.ico' } },
    { id: 'defly', name: 'Defly', wallet: defly, metadata: { name: 'Defly', icon: 'https://defly.app/favicon.ico' } },
    { id: 'daffi', name: 'Daffi', wallet: daffi, metadata: { name: 'Daffi', icon: 'https://daffi.me/favicon.ico' } },
  ];

  return (
    <UseWalletProvider
      value={{
        wallets: walletProviders,
        algodClient,
        network: 'testnet'
      }}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
