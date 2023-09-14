import React, { useState, useEffect } from "react";
import { useNavigate, Route, Routes, NavLink } from "react-router-dom";
import { MdOutlineCalculate } from "react-icons/md";
import { HiMenu, HiOutlineHome } from "react-icons/hi";
import { FiFolder, FiLogOut } from "react-icons/fi";
import { AiFillCalendar, AiFillPieChart } from "react-icons/ai";
import Data from "./Data";
import ModalLogout from "../../components/modal/ModalLogout";
import DataFinish from "./DataFinish";
import DataReject from "./DataReject";

const MainAdmin = () => {
  const [open, setOpen] = useState(true);
  const [openModalLogout, setOpenModalLogout] = useState(false);
  const navigate = useNavigate();

  const menus = [
    {
      name: "Berkas Belum Selesai",
      link: "/pages/home",
      icon: FiFolder,
    },
    {
      name: "Berkas Selesai",
      link: "/pages/finish",
      icon: FiFolder,
    },
    {
      name: "Berkas Ditolak",
      link: "/pages/reject",
      icon: FiFolder,
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("AuthToken");
    navigate("/login");
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("Auth Token");

    if (!authToken) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className={`flex h-screen overflow-y-hidden`}>
        <div
          className={`bg-white min-h-screen ${
            open ? "w-72" : "w-16"
          } duration-500 shadow-md text-gray-900 px-4`}
        >
          <div className="flex justify-end py-3">
            <HiMenu
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
          <div className="flex flex-col justify-between h-[90%]">
            <div className="relative flex flex-col gap-4 mt-4">
              {menus.map((menu, i) => (
                <NavLink
                  to={menu.link}
                  key={i}
                  className={` ${
                    menu.margin && "mt-5"
                  } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-red-700 hover:text-white rounded-md`}
                  activeClassName="active"
                >
                  <div>{React.createElement(menu.icon, { size: "20" })}</div>
                  <h2
                    className={`whitespace-pre ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    {menu.name}
                  </h2>
                  <h2
                    className={`${
                      open && "hidden"
                    } absolute z-50 left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                  >
                    {menu.name}
                  </h2>
                </NavLink>
              ))}
            </div>
            <button
              onClick={() => setOpenModalLogout(true)}
              className="mt-4 group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-red-700 hover:text-white rounded-md"
            >
              <div>
                <FiLogOut size="20" />
              </div>
              <h2
                className={`whitespace-pre  ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                Keluar
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute z-50 left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                Keluar
              </h2>
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-hidden font-semibold text-gray-900">
          <div className="p-5">
            <Routes>
              <Route path="/home" element={<Data />} />
              <Route path="/finish" element={<DataFinish />} />
              <Route path="/reject" element={<DataReject />} />
            </Routes>
          </div>
        </div>
      </div>
      <ModalLogout
        open={openModalLogout}
        onClose={() => setOpenModalLogout(false)}
        logout={handleLogout}
      />
    </>
  );
};

export default MainAdmin;
