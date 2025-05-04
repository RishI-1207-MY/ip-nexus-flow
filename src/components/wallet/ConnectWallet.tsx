
import { useWallet } from '@txnlab/use-wallet-react';
import Account from './Account';

interface ConnectWalletInterface {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { activeAccount, providers, activeAddress } = useWallet();

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`} style={{ display: openModal ? 'block' : 'none' }}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">Select wallet provider</h3>

        <div className="grid m-2 pt-5">
          {activeAddress && (
            <>
              <Account />
              <div className="divider" />
            </>
          )}

          {!activeAddress &&
            providers?.map((provider) => (
              <button
                data-test-id={`${provider.id}-connect`}
                className="btn border-teal-800 border-1 m-2"
                key={`provider-${provider.id}`}
                onClick={() => {
                  return provider.connect();
                }}
              >
                {provider.id !== 'kmd' && (
                  <img
                    alt={`wallet_icon_${provider.id}`}
                    src={provider.metadata.icon}
                    style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                  />
                )}
                <span>{provider.id === 'kmd' ? 'LocalNet Wallet' : provider.metadata.name}</span>
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
          {activeAddress && (
            <button
              className="btn btn-warning"
              data-test-id="logout"
              onClick={async () => {
                if (activeAccount?.providerId) {
                  const activeProvider = providers.find((p) => p.id === activeAccount.providerId);
                  if (activeProvider) {
                    await activeProvider.disconnect();
                  } else {
                    // Fallback cleanup
                    localStorage.removeItem('@txnlab/use-wallet:v3');
                    localStorage.removeItem('@txnlab/use-wallet:v4');
                    window.location.reload();
                  }
                }
              }}
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
