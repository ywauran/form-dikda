import React, { useState } from "react";
import AlertWarn from "../alert/AlertWarn";

const ModalDelete = ({ open, onClose, handleDelete }) => {
  const [reason, setReason] = useState("");
  const [isEmptyReason, setIsEmptyReason] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleSendClick = () => {
    if (reason.trim() === "") {
      // Show custom alert when the textarea is empty
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      setAlertMessage("Alasan Penolakan tidak boleh kosong.");
      setIsEmptyReason(true);
    } else {
      handleDelete(reason);
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="modal">
          <form className="w-96 modal-box" method="dialog">
            <div className="p-4 overflow-hidden bg-white rounded-lg">
              <label
                htmlFor="message"
                className="block mb-2 text-lg font-medium text-center text-gray-900 dark:text-white"
              >
                Alasan Penolakan
              </label>
              <textarea
                id="message"
                rows="4"
                className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-red-500 focus:border-redring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-redring-red-500 ${
                  isEmptyReason ? "border-red-500" : ""
                }`}
                placeholder=""
                onChange={(e) => {
                  setReason(e.target.value);
                  setIsEmptyReason(false); // Reset the validation when typing
                }}
              ></textarea>
              {showAlert && <AlertWarn description={alertMessage} />}
              <div className="flex items-center justify-center p-4 space-x-2 border-gray-200 rounded-b">
                <button
                  type="button"
                  className="w-24 btn button__primary"
                  onClick={handleSendClick}
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-24 button__secondary"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalDelete;
