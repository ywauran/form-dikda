import React from "react";

const AlertSuccess = ({ title, desription }) => {
  return (
    <div
      className="p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <span className="font-medium">{title}</span> {desription}
    </div>
  );
};

export default AlertSuccess;
