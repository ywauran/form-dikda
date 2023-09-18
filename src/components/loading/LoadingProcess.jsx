import React from "react";

const LoadingProcess = () => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="modal">
          <div className=" modal-box">
            <div className="p-2 overflow-hidden text-center text-red-500 rounded-lg">
              <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#ff0000"
                  stroke-width="8"
                  fill="none"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    from="0 251.2"
                    to="251.2 0"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="251.2"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingProcess;
