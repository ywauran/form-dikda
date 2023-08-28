import React from "react";

const AlertWarn = ({ title, description }) => {
  return (
    <div
      class="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <span class="font-medium">{title}</span> {description}
    </div>
  );
};

export default AlertWarn;
