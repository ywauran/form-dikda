import React from "react";

const AlertTopWarn = ({ message }) => {
  return (
    <div className="fixed left-0 right-0 z-50 px-4 py-2 mx-auto font-semibold text-center text-white bg-red-500 rounded-md top-4 w-max">
      {message}
    </div>
  );
};

export default AlertTopWarn;
