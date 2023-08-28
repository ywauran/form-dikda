import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable"; // Adjust the path
import { database } from "../../config/firebase";
import { ref, get, query, orderByKey } from "firebase/database";
const Data = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    // Simulating data retrieval
    const simulatedData = {
      "-Ncwk1Gpga2OZ0e2I-M4": {
        // ...data object
      },
      "-Ncwl1WnaiUG3wwciRZG": {
        // ...data object
      },
      // Add more data entries
    };

    setData(simulatedData);
  }, []);

  const queryData = async () => {
    try {
      const dataRef = ref(database, "data");

      // Retrieve the data using the get() method
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        // Convert the snapshot's value into the data object
        const data = snapshot.val();

        // Log the data
        console.log("Data from the database:", data);

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
      <h3 className="text-center font-bold text-3xl">Daftar Data</h3>
      <DataTable data={data} />
    </div>
  );
};

export default Data;
