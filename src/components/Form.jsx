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
  const [loading, setLoading] = useState(false); // Add loading state

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
        setLoading(true); // Set loading state to true
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
          "Data dan file berhasil disimpan.",
          5000
        );
        resetState();
      } catch (error) {
        console.error("Error uploading files:", error);

        // Show error alert for 5 seconds
        showAlertWithTimeout(
          "error",
          "Terjadi kesalahan saat mengunggah file. Silakan coba lagi.",
          5000
        );
      } finally {
        setLoading(false); // Reset loading state after processing
      }
    } else {
      showAlertWithTimeout(
        "error",
        "Silakan pilih salah satu opsi dan unggah kedua file.",
        5000
      );
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-8 md:max-w-md box">
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
            className="flex items-center justify-center px-4 py-2 transition duration-150 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-2 text-gray-500"
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
            className="flex items-center justify-center px-4 py-2 transition duration-150 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-2 text-gray-500"
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
          disabled={loading} // Disable the button when loading
          className="w-full px-4 py-2 text-white transition duration-150 bg-blue-500 rounded-md hover:bg-blue-600"
        >
          {loading ? "Menyimpan..." : "Simpan"}{" "}
          {/* Change button text based on loading state */}
        </button>
        {showAlert && alertType === "success" && (
          <AlertSuccess title="Berhasil" description={alertMessage} />
        )}
        {showAlert && alertType === "error" && (
          <AlertWarn title="Error" description={alertMessage} />
        )}
      </div>
    </div>
  );
};

export default Form;
