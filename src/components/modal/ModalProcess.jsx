import React from "react";

const ModalProcess = ({ open, onClose, handleProcess }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal">
        <form className="w-96 modal-box" method="dialog">
          <div className="overflow-hidden bg-white rounded-lg">
            <div className="flex items-start justify-center p-4 rounded-t">
              <h3 className="text-2xl font-semibold text-center text-gray-900">
                Selesai
              </h3>
            </div>

            <div className="p-2 space-y-6">
              <p className="text-lg leading-relaxed text-center text-gray-500">
                Apakah data ini akan diproses?
              </p>
            </div>

            <div className="flex items-center justify-center p-4 space-x-2 border-gray-200 rounded-b">
              <button
                type="button"
                className="w-24 btn button__primary"
                onClick={() => {
                  handleProcess();
                  onClose();
                }}
              >
                Ya
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-24 button__secondary"
              >
                Tidak
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProcess;
