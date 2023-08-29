import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable"; // Adjust the path
import { database } from "../../config/firebase";
import { ref, get } from "firebase/database";
const Data = () => {
  const [data, setData] = useState({});

  const queryData = async () => {
    try {
      const dataRef = ref(database, "data");

      // Retrieve the data using the get() method
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        // Convert the snapshot's value into the data object
        const data = snapshot.val();

        // You can set the data to your state if needed
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
      <h3 className="text-3xl font-bold text-center">Daftar Data</h3>
      <DataTable data={data} />
    </div>
  );
};

export default Data;
