
import { ReactNode, useMemo } from 'react';
import { PROVIDER_ID, WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
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

  // Configure the providers that will be used in the app
  const providers = useMemo(() => [
    { id: PROVIDER_ID.PERA, clientStatic: pera },
    { id: PROVIDER_ID.DEFLY, clientStatic: defly },
    { id: PROVIDER_ID.DAFFI, clientStatic: daffi }
  ], [pera, defly, daffi]);

  return (
    <UseWalletProvider
      providers={providers}
      nodeConfig={{ 
        network: 'testnet', 
        nodeServer: algodServer,
        nodePort: algodPort,
        nodeToken: algodToken 
      }}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
