
import { useWallet } from '@txnlab/use-wallet-react';
import Account from './Account';

interface ConnectWalletInterface {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { activeAccount, wallets, setActiveAccount } = useWallet();

  const handleDisconnect = async () => {
    if (activeAccount) {
      const activeWallet = wallets.find(
        wallet => wallet.accounts.some(acc => acc.address === activeAccount.address)
      );
      
      if (activeWallet) {
        await activeWallet.disconnect();
      }
      
      setActiveAccount(null);
    }
  };

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`} style={{ display: openModal ? 'block' : 'none' }}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">Select wallet provider</h3>

        <div className="grid m-2 pt-5">
          {activeAccount && (
            <>
              <Account />
              <div className="divider" />
            </>
          )}

          {!activeAccount &&
            wallets.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="btn border-teal-800 border-1 m-2"
                key={`wallet-${wallet.id}`}
                onClick={async () => {
                  if (wallet.isConnected) return;
                  
                  try {
                    const accounts = await wallet.connect();
                    if (accounts && accounts.length > 0) {
                      setActiveAccount(accounts[0]);
                    }
                  } catch (error) {
                    console.error("Failed to connect wallet:", error);
                  }
                }}
              >
                {wallet.metadata?.icon && (
                  <img
                    alt={`wallet_icon_${wallet.id}`}
                    src={wallet.metadata.icon}
                    style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                  />
                )}
                <span>{wallet.metadata?.name || wallet.id}</span>
              </button>
            ))}
        </div>

        <div className="modal-action grid">
          <button
            data-test-id="close-wallet-modal"
            className="btn"
            onClick={() => {
              closeModal();
            }}
          >
            Close
          </button>
          {activeAccount && (
            <button
              className="btn btn-warning"
              data-test-id="logout"
              onClick={handleDisconnect}
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
};

export default ConnectWallet;
