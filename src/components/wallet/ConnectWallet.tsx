
import { useWallet } from '@txnlab/use-wallet-react';
import Account from './Account';

interface ConnectWalletInterface {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { providers, activeAccount } = useWallet();

  const handleDisconnect = async () => {
    if (activeAccount) {
      await activeAccount.disconnect();
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
            providers?.map((provider) => (
              <button
                data-test-id={`${provider.metadata.id}-connect`}
                className="btn border-teal-800 border-1 m-2"
                key={`provider-${provider.metadata.id}`}
                onClick={() => {
                  provider.connect();
                }}
              >
                <img
                  alt={`wallet_icon_${provider.metadata.id}`}
                  src={provider.metadata.icon}
                  style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                />
                <span>{provider.metadata.name}</span>
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
