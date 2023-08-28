import React from "react";

const AlertSuccess = ({ title, desription }) => {
  return (
    <div
      class="p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <span class="font-medium">{title}</span> {desription}
    </div>
  );
};

export default AlertSuccess;
