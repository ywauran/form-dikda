import React, { useState, useEffect } from "react";
import { data } from "../utils/helper.js";
import Select from "react-select";
import { storage, database } from "../config/firebase.js";
import { ref, push, getDownloadURL, uploadBytes } from "firebase/storage";
import {
  ref as rtdbRef,
  push as rtdbPush,
  update,
  get,
} from "firebase/database";
import AlertWarn from "./alert/AlertWarn";
import AlertSuccess from "./alert/AlertSuccess";
import { Link } from "react-router-dom";

const Form = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [skFile, setSKFile] = useState(null);
  const [kkFile, setKKFile] = useState(null);
  const [kombelFile, setKombelFile] = useState(null); // New input field
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataUploaded, setDataUploaded] = useState([]);

  const queryData = async () => {
    try {
      const dataRef = rtdbRef(database, "data");
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const data = [];

        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          data.push(item);
        });

        setDataUploaded(data);
        console.log(dataUploaded);
      } else {
        console.log("No data available.");
      }
    } catch (error) {
      console.error("Error querying data:", error);
      throw error;
    }
  };

  useEffect(() => {
    queryData();
  }, []);

  const resetState = () => {
    setSelectedItem(null);
    setSKFile(null);
    setKKFile(null);
    setKombelFile(null); // Reset the new input field
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
    if (selectedFile && selectedFile.type === "application/pdf") {
      setSKFile(selectedFile);
    } else {
      showAlertWithTimeout(
        "error",
        "Mohon pilih file PDF untuk SK PPPK Gubernur.",
        5000
      );
    }
  };

  const handleKKFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setKKFile(selectedFile);
    } else {
      showAlertWithTimeout(
        "error",
        "Mohon pilih file PDF untuk Kartu Keluarga.",
        5000
      );
    }
  };

  // New handler for the Bukti Terdaftar/memiliki Kombel input
  // New handler for the Bukti Terdaftar/memiliki Kombel input
  const handleKombelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg")
    ) {
      setKombelFile(selectedFile);
    } else {
      showAlertWithTimeout(
        "error",
        "Mohon pilih file gambar (PNG/JPEG) untuk Bukti Terdaftar/memiliki Kombel.",
        5000
      );
    }
  };

  // Buat daftar nama dari dataUploaded
  const existingNames = dataUploaded.map((item) => item.name);

  // Filter data berdasarkan nama yang belum ada di dataUploaded
  const options = data
    .filter((item) => !existingNames.includes(item.name))
    .map((item) => ({
      value: item.no,
      label: item.name,
    }));

  const handleSave = async () => {
    if (selectedItem && skFile && kkFile && kombelFile) {
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
          `files/${newPushedDataRef.key} Kartu Keluarga.pdf`
        );
        await uploadBytes(kkFileRef, kkFile);
        const kkFileDownloadUrl = await getDownloadURL(kkFileRef);

        const kombelFileRef = ref(
          storage,
          `files/${newPushedDataRef.key} Kombel.pdf`
        );
        await uploadBytes(kombelFileRef, kombelFile);
        const kombelFileDownloadUrl = await getDownloadURL(kombelFileRef);

        await update(newPushedDataRef, {
          skFileUrl: skFileDownloadUrl,
          kkFileUrl: kkFileDownloadUrl,
          kombelFileUrl: kombelFileDownloadUrl, // Update the new field
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
        <h1 className="mb-4 text-xl font-bold text-center">Formulir</h1>
        <Select
          id="underline_select"
          options={options}
          className="w-full mb-4"
          placeholder="Silahkan pilih nama anda"
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

        {/* New input field for Bukti Terdaftar/memiliki Kombel */}
        <div className="mb-4">
          <label htmlFor="file3" className="block mb-2 font-semibold">
            Bukti Terdaftar/memiliki Kombel melalui akun belajar id
          </label>
          <label
            htmlFor="file3"
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
            <span>{kombelFile ? kombelFile.name : "Pilih File"}</span>
            <input
              type="file"
              id="file3"
              onChange={handleKombelFileChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full px-4 py-2 text-white transition duration-150 bg-red-500 rounded-md hover:bg-red-600"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        {showAlert && alertType === "success" && (
          <AlertSuccess title="Berhasil" description={alertMessage} />
        )}
        {showAlert && alertType === "error" && (
          <AlertWarn title="Error" description={alertMessage} />
        )}
        <div className="mt-4 text-red-500">
          <span>Jika ingin melihat status verifikasi, silahkan lihat </span>
          <Link to="/status" target="_blank" className="underline">
            di sini.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
