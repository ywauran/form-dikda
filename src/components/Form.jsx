import React, { useState } from "react";
import { data } from "../utils/helper.js";
import Select from "react-select";
import { storage, database } from "../config/firebase.js";
import { ref, push, getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as rtdbRef, push as rtdbPush, update } from "firebase/database";
import AlertWarn from "./alert/AlertWarn";
import AlertSuccess from "./alert/AlertSuccess";

const Form = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [skFile, setSKFile] = useState(null);
  const [kkFile, setKKFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(""); // "success" or "error"
  const [alertMessage, setAlertMessage] = useState("");

  const resetState = () => {
    setSelectedItem(null);
    setSKFile(null);
    setKKFile(null);
  };

  const showAlertWithTimeout = (type, message, duration) => {
    setShowAlert(true);
    setAlertType(type);
    setAlertMessage(message);

    setTimeout(() => {
      setShowAlert(false);
      setAlertType("");
      setAlertMessage("");
    }, duration);
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedItem(selectedOption);
  };

  const handleSKFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setSKFile(selectedFile);
  };

  const handleKKFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setKKFile(selectedFile);
  };

  const options = data.map((item) => ({
    value: item.no,
    label: item.name,
  }));

  const handleSave = async () => {
    if (selectedItem && skFile && kkFile) {
      try {
        const selectedData = data.find(
          (item) => item.no === selectedItem.value
        );

        const newDataRef = rtdbRef(database, "data");
        const newPushedDataRef = rtdbPush(newDataRef);
        await update(newPushedDataRef, selectedData);

        const skFileRef = ref(
          storage,
          `files/${newPushedDataRef.key} SK PPPK Gubernur.pdf`
        );
        await uploadBytes(skFileRef, skFile);
        const skFileDownloadUrl = await getDownloadURL(skFileRef);

        const kkFileRef = ref(
          storage,
          `files/${newPushedDataRef.key}Kartu Keluarga.pdf`
        );
        await uploadBytes(kkFileRef, kkFile);
        const kkFileDownloadUrl = await getDownloadURL(kkFileRef);

        await update(newPushedDataRef, {
          skFileUrl: skFileDownloadUrl,
          kkFileUrl: kkFileDownloadUrl,
        });
        // Show success alert for 5 seconds
        showAlertWithTimeout(
          "success",
          "Data and files saved successfully!",
          5000
        );
        resetState();
      } catch (error) {
        console.error("Error uploading files:", error);

        // Show error alert for 5 seconds
        showAlertWithTimeout(
          "error",
          "An error occurred during file upload. Please try again.",
          5000
        );
      }
    } else {
      showAlertWithTimeout(
        "error",
        "Please select an option and upload both files.",
        5000
      );
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-sm md:max-w-md w-full box p-8">
        <h1 className="mb-4 font-bold text-center">Formulir</h1>
        <Select
          id="underline_select"
          options={options}
          className="w-full mb-4"
          placeholder="Select an option"
          isSearchable
          onChange={handleSelectChange}
        />

        <div className="mb-4">
          <label htmlFor="file1" className="block mb-2 font-semibold">
            SK PPPK Gubernur
          </label>
          <label
            htmlFor="file1"
            className="flex items-center justify-center px-4 py-2 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>{skFile ? skFile.name : "Pilih File"}</span>
            <input
              type="file"
              id="file1"
              accept=".pdf"
              onChange={handleSKFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="file2" className="block mb-2 font-semibold">
            Kartu Keluarga
          </label>
          <label
            htmlFor="file2"
            className="flex items-center justify-center px-4 py-2 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>{kkFile ? kkFile.name : "Pilih File"}</span>
            <input
              type="file"
              id="file2"
              accept=".pdf"
              onChange={handleKKFileChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150"
        >
          Simpan
        </button>
        {showAlert && alertType === "success" && (
          <AlertSuccess title="Success" description={alertMessage} />
        )}
        {showAlert && alertType === "error" && (
          <AlertWarn title="Error" description={alertMessage} />
        )}
      </div>
    </div>
  );
};

export default Form;
