import { useState, useEffect } from "react";
import DataTableFinish from "../../components/user/DataTableFinish";
import { database } from "../../config/firebase";
import { ref, get } from "firebase/database";
import DataTableReject from "../../components/user/DataTableReject";
const StatusPage = () => {
  const [dataFinish, setDataFinish] = useState([]);
  const [dataReject, setDataReject] = useState([]);

  const [selected, setSelected] = useState(true); // Default role is set to 'teacher'

  const handleRoleChange = (role) => {
    setSelected(role);
  };

  const queryData = async () => {
    try {
      const dataRef = ref(database, "data");
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const data = [];

        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          if (item.isFinish === true) {
            data.push(item);
          }
        });

        setDataFinish(data);
      } else {
        console.log("No data available.");
      }
    } catch (error) {
      console.error("Error querying data:", error);
      throw error;
    }
  };

  const queryDataReject = async () => {
    try {
      const dataRef = ref(database, "dataReject");
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const data = [];

        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          data.push(item);
        });

        setDataReject(data);
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
    queryDataReject();
  }, []);

  return (
    <>
      <div className="flex flex-col mt-8 px-9">
        <div className="sm:px-48 lg:px-80 xl:px-[480px]">
          <div className="flex items-center justify-center w-full py-2 mx-auto font-semibold bg-white border rounded-full">
            <div
              onClick={() => handleRoleChange(true)}
              className={`text-center px-6 py-2 ${
                selected === true
                  ? "bg-[#C81E1E] text-white"
                  : "bg-white text-[#C81E1E]"
              } rounded-3xl xl:px-11 cursor-pointer`}
            >
              Diterima
            </div>
            <div
              onClick={() => handleRoleChange(false)}
              className={`text-center px-6 py-2 ${
                selected === false
                  ? "bg-[#C81E1E] text-white"
                  : "bg-white text-[#C81E1E]"
              } rounded-3xl xl:px-11 cursor-pointer`}
            >
              Ditolak
            </div>
          </div>
        </div>
        <div className="mt-4">
          {selected === true ? (
            <DataTableFinish data={dataFinish} setData={setDataFinish} />
          ) : (
            <DataTableReject data={dataReject} setData={setDataReject} />
          )}
        </div>
      </div>
    </>
  );
};

export default StatusPage;
