import React, { useState } from "react";
import ModalFinish from "./modal/ModalFinish";

const DataTableFinish = ({ data, setData }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = Object.values(data).filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.education &&
        item.education.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalData = filteredData.length;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
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
                    <tr
                      key={index + 1 + startIndex}
                      className="hover:bg-gray-100"
                    >
                      <td className="px-4 py-3 border">
                        {index + 1 + startIndex}
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
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex flex-col items-center justify-center mt-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
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
                  Halaman {currentPage} dari {pageCount} - Total {totalData}{" "}
                  data
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DataTableFinish;
