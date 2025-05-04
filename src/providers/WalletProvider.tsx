
import { ReactNode } from 'react';
import { useInitializeProviders, WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
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
  // Initialize providers and get the wallets with useInitializeProviders
  const { providers, activeAddress } = useInitializeProviders([
    { id: 'pera', clientStatic: PeraWalletConnect },
    { id: 'defly', clientStatic: DeflyWalletConnect },
    { id: 'daffi', clientStatic: DaffiWalletConnect },
  ]);

  return (
    <UseWalletProvider
      providers={providers}
      activeAddress={activeAddress}
      activeProvider={providers.find((p) => p.accounts.length > 0)?.id}
      algodClient={algodClient}
      network="testnet"
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
