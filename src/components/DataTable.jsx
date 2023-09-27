import React, { useState, useEffect } from "react";
import ModalFinish from "./modal/ModalFinish";
import { database } from "../config/firebase";
import { ref, set, get, push, remove } from "firebase/database";
import ModalDelete from "./modal/ModalDelete";
import ModalProcess from "./modal/ModalProcess";
import LoadingProcess from "./loading/LoadingProcess";
import AlertTopSuccess from "./alert/AlertTopSuccess";
import AlertTopWarn from "./alert/AlertTopWarn";

const DataTable = () => {
  const itemsPerPage = 10;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModalFinish, setOpenModalFinish] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalProcess, setOpenModalProcess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const queryData = async () => {
    try {
      const dataRef = ref(database, "data");

      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        setData(data);
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

  let filteredData = Object.values(data)
    .filter(
      (item) =>
        (item.name &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.education &&
          item.education.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((item) => !item.isFinish);

  function filterRedundantData(data) {
    if (!Array.isArray(data)) {
      return [];
    }

    const filteredData = {};

    for (const item of data) {
      if (!item.isFinish) {
        if (!filteredData[item.name]) {
          filteredData[item.name] = item;
        }
      }
    }

    return Object.values(filteredData);
  }

  filteredData = filterRedundantData(filteredData);
  const allKeys = Object.keys(data);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSelectedItem = (key, conditional) => {
    if (conditional === "finish") {
      setOpenModalFinish(true);
    } else if (conditional === "process") {
      setOpenModalProcess(true);
    } else {
      setOpenModalDelete(true);
    }
    setSelectedItem(key);
    const dataRef = ref(database, `data/${key}`);
    console.log(dataRef);
  };

  const handleDelete = (reason) => {
    try {
      const key = selectedItem;
      if (!key) {
        console.error("Key not found.");
        return;
      }

      setIsLoading(true);
      // Mendapatkan data dari database Firebase
      const dataRef = ref(database, `data/${key}`);

      get(dataRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Data berhasil ditemukan
            const data = snapshot.val();
            data.reason = reason;
            // Referensi untuk data di path dataReject
            const dataRejectRef = ref(database, "dataReject");
            const newDataRef = push(dataRejectRef); // Generate a new unique key

            // Menyalin data ke path dataReject
            return set(newDataRef, data);
          } else {
            console.log("Data tidak ditemukan.");
          }
        })
        .then(() => {
          // Setelah data berhasil disalin, hapus data dari path data
          return remove(dataRef);
        })
        .then(() => {
          // queryData() harus dipanggil setelah data dihapus
          return queryData();
        })
        .then(() => {
          setIsSuccess(true);
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
        })
        .finally(() => {
          setIsLoading(false); // Hentikan loading setelah operasi selesai
          setIsSuccess(false);
        });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleFinish = () => {
    try {
      const key = selectedItem;
      if (!key) {
        console.error("Item key not found.");
        return;
      }

      if (allKeys.includes(key)) {
        const updatedData = { ...data };
        updatedData[key].isFinish = true;

        const dataRef = ref(database, "data");

        const newData = { ...data };
        newData[key].isFinish = true;
        set(dataRef, newData);
        queryData();
        // setData(updatedData);

        console.log("Berhasil ditandai sebagai selesai");
      } else {
        console.error(`Key '${key}' not found in allKeys.`);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui data:", error);
    }
  };

  const handleProcess = () => {
    try {
      const key = selectedItem;
      if (!key) {
        console.error("Item key not found.");
        return;
      }

      if (allKeys.includes(key)) {
        const updatedData = { ...data };
        updatedData[key].isProcess = true;

        const dataRef = ref(database, "data");

        const newData = { ...data };
        newData[key].isProcess = true;
        set(dataRef, newData);

        // setData(updatedData);
        queryData();

        console.log("Berhasil ditandai sebagai selesai");
      } else {
        console.error(`Key '${key}' not found in allKeys.`);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat memperbarui data:", error);
    }
  };

  return (
    <>
      {isSuccess ? <AlertTopSuccess message="Berhasil dihapus" /> : null}
      {isError ? <AlertTopWarn message="Gagal" /> : null}
      <div className="p-8">
        <div className="flex justify-end">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau pendidikan"
              className="bg-gray-50 border max-w-lg  my-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute w-6 h-6 text-gray-500 transform -translate-y-1/2 pointer-events-none left-3 top-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          {visibleItems.length === 0 ? (
            <div className="p-4 border shadow">
              <p className="font-semibold text-center">Data Kosong</p>
            </div>
          ) : (
            <>
              <table className="table w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3 border">No</th>
                    <th className="px-4 py-3 border">Nama</th>
                    <th className="px-4 py-3 border">Pendidikan</th>
                    <th className="px-4 py-3 border">Unit Kerja</th>
                    <th className="px-4 py-3 border">Berkas SK</th>
                    <th className="px-4 py-3 border">Berkas KK</th>
                    <th className="px-4 py-3 border">Bukti Kombel</th>
                    <th className="px-4 py-3 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item, index) => (
                    <tr key={item.no} className="hover:bg-gray-100">
                      <td className="px-4 py-3 border">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 border">{item.name}</td>
                      <td className="px-4 py-3 text-center border">
                        {item.education}
                      </td>

                      <td className="px-4 py-3 text-center border">
                        {item.workUnit}
                      </td>
                      <td className="px-4 py-3 border ">
                        <a
                          href={item.skFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-red-600 underline hover:no-underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          SK File
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center border ">
                        <a
                          href={item.kkFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-red-600 underline hover:no-underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          KK File
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center border ">
                        <a
                          href={item.kombelFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center text-red-600 underline hover:no-underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          Bukti Kombel
                        </a>
                      </td>
                      <td>
                        {item?.isFinish === true ? null : (
                          <>
                            {item?.isProcess === true ? (
                              <td className="flex items-center px-4 py-3 space-x-2 text-center border">
                                <button
                                  className="button__third"
                                  onClick={() => {
                                    handleSelectedItem(
                                      Object.keys(data).find(
                                        (key) => data[key] === item
                                      ),
                                      "finish"
                                    );
                                  }}
                                >
                                  Selesai
                                </button>
                                <button
                                  className="button__secondary"
                                  onClick={() => {
                                    handleSelectedItem(
                                      Object.keys(data).find(
                                        (key) => data[key] === item
                                      ),
                                      "delete"
                                    );
                                  }}
                                >
                                  Tolak
                                </button>
                              </td>
                            ) : (
                              <td className="flex items-center px-4 py-3 space-x-2 text-center border">
                                <button
                                  className="button__primary"
                                  onClick={() => {
                                    handleSelectedItem(
                                      Object.keys(data).find(
                                        (key) => data[key] === item
                                      ),
                                      "process"
                                    );
                                  }}
                                >
                                  Proses
                                </button>
                                <button
                                  className="button__secondary"
                                  onClick={() => {
                                    handleSelectedItem(
                                      Object.keys(data).find(
                                        (key) => data[key] === item
                                      ),
                                      "delete"
                                    );
                                  }}
                                >
                                  Tolak
                                </button>
                              </td>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex flex-col items-center justify-between mt-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <p className="font-semibold">
                  Jumlah data {filteredData.length}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 font-bold text-white bg-red-400 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <span className="font-semibold">
                    Halaman {currentPage} dari {pageCount}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    className="p-2 font-bold text-white bg-red-400 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ModalFinish
        open={openModalFinish}
        onClose={() => setOpenModalFinish(false)}
        handleFinish={handleFinish}
      />
      <ModalDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        handleDelete={handleDelete}
      />
      <ModalProcess
        open={openModalProcess}
        onClose={() => setOpenModalProcess(false)}
        handleProcess={handleProcess}
      />
      {isLoading ? <LoadingProcess /> : null}
    </>
  );
};

export default DataTable;
