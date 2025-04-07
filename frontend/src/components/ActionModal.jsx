import Modal from "react-modal";

Modal.setAppElement("#root");

const ActionModal = ({ isOpen, onRequestClose, action, item, onConfirm }) => {
  let actionText = "";
  let buttonText = "";
  let message = "";

  switch (action) {
    case "buy":
      actionText = "Buy";
      buttonText = "Buy Now";
      message = `Would you like to buy <strong> ${item?.name} </strong>?`;
      break;
    case "rent":
      actionText = "Rent";
      buttonText = "Rent Now";
      message = `Would you like to rent <strong>${item?.name}</strong> for <strong> $${item?.rentPerDay} </strong> per day?`;
      break;
    case "swap":
      actionText = "Swap";
      buttonText = "Swap Now";
      message = `Would you like to swap <strong> ${item?.name} </strong>?`;
      break;
    default:
      return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={`${actionText} Item Modal`}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="text-xl font-bold mb-4">{actionText} Item</h2>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <div className="flex justify-end gap-4 mt-4">
        <button className="btn btn-outline w-32" onClick={onRequestClose}>
          Close
        </button>
        <button
          className=" btn btn-primary w-32"
          onClick={() => {
            onConfirm(action);
            onRequestClose();
          }}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

export default ActionModal;
