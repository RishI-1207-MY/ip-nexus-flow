
import { ReactNode, useMemo } from 'react';
import { WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import algosdk from 'algosdk';

// Create the client
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodToken = '';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  // Create a memoized algodClient instance
  const algodClient = useMemo(() => {
    return new algosdk.Algodv2(algodToken, algodServer, algodPort);
  }, []);

  // Create wallet instances
  const pera = useMemo(() => new PeraWalletConnect(), []);
  const defly = useMemo(() => new DeflyWalletConnect(), []);
  const daffi = useMemo(() => new DaffiWalletConnect(), []);

  // Configure the adapters to use with the use-wallet library
  // Note: we no longer use PROVIDER_ID as it's not exported
  const walletAdapters = useMemo(() => [
    { adapter: pera, id: 'pera' },
    { adapter: defly, id: 'defly' },
    { adapter: daffi, id: 'daffi' }
  ], [pera, defly, daffi]);

  return (
    <UseWalletProvider
      wallets={walletAdapters}
      nodeConfig={{
        network: 'testnet', 
        nodeServer: algodServer,
        nodePort: algodPort,
        nodeToken: algodToken
      }}
      algosdkStatic={algosdk}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
