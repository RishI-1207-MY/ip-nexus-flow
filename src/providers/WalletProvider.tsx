
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

  // Configure the wallets that will be used in the app
  const wallets = useMemo(() => [
    { id: 'pera-wallet', name: 'Pera', adapter: pera },
    { id: 'defly-wallet', name: 'Defly', adapter: defly },
    { id: 'daffi-wallet', name: 'Daffi', adapter: daffi }
  ], [pera, defly, daffi]);

  return (
    <UseWalletProvider
      wallets={wallets}
      network="testnet"
      algodClient={algodClient}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
