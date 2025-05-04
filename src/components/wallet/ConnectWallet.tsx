
import { useWallet } from '@txnlab/use-wallet-react'
import Account from './Account'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { activeAccount, providers, activeProvider, setActiveProvider } = useWallet()

  const handleDisconnect = async () => {
    try {
      if (activeProvider) {
        await activeProvider.disconnect();
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl">Select Wallet Provider</h3>
          <Button variant="ghost" size="icon" onClick={closeModal}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {activeAccount && (
            <>
              <Account />
              <div className="h-px bg-border my-4" />
            </>
          )}

          {!activeAccount && providers?.map((provider) => (
            <Button
              data-test-id={`${provider.metadata.id}-connect`}
              className="flex items-center justify-start w-full gap-2 bg-card hover:bg-card/80 text-card-foreground border border-border"
              key={`wallet-${provider.metadata.id}`}
              variant="outline"
              onClick={() => {
                setActiveProvider(provider.metadata.id);
              }}
            >
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-muted">
                {provider.metadata.name.charAt(0)}
              </div>
              <span>{provider.metadata.name}</span>
            </Button>
          ))}

          {activeAccount && (
            <Button
              className="w-full bg-destructive hover:bg-destructive/90"
              data-test-id="logout"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectWallet
