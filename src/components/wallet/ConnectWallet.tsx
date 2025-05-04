
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
              <div key={`wallet-${wallet.id}`} className="mb-2">
                {wallet.accounts.length === 0 ? (
                  <button
                    className="btn border-teal-800 border-1 w-full"
                    onClick={() => wallet.connect()}
                  >
                    {wallet.metadata?.icon && (
                      <img
                        alt={`wallet_icon_${wallet.id}`}
                        src={wallet.metadata.icon}
                        style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                      />
                    )}
                    <span>Connect {wallet.metadata?.name || wallet.id}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    {wallet.accounts.map(account => (
                      <button
                        key={account.address}
                        className="btn border-teal-800 border-1 w-full"
                        onClick={() => setActiveAccount(account)}
                      >
                        <span>{account.name || account.address.substring(0, 8)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
