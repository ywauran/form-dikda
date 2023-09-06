import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable"; // Adjust the path
import { database } from "../../config/firebase";
import { ref, get } from "firebase/database";
const Data = () => {
  const [data, setData] = useState({});

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

  return (
    <div className="p-4 ">
      <h3 className="text-3xl font-bold text-center">
        Daftar Data Belum Selesai
      </h3>
      <DataTable data={data} />
    </div>
  );
};

export default Data;
