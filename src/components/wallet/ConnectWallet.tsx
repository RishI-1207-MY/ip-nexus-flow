
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
  const { activeAccount, wallets, activeAddress, disconnect } = useWallet()

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

          {!activeAccount && wallets?.map((wallet) => (
            <Button
              data-test-id={`${wallet.id}-connect`}
              className="flex items-center justify-start w-full gap-2 bg-card hover:bg-card/80 text-card-foreground border border-border"
              key={`wallet-${wallet.id}`}
              variant="outline"
              onClick={() => wallet.connect()}
            >
              {wallet.icon && (
                <img
                  alt={`wallet_icon_${wallet.id}`}
                  src={wallet.icon}
                  className="w-6 h-6 object-contain"
                />
              )}
              <span>{wallet.name}</span>
            </Button>
          ))}

          {activeAccount && (
            <Button
              className="w-full bg-destructive hover:bg-destructive/90"
              data-test-id="logout"
              onClick={async () => {
                await disconnect();
              }}
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
