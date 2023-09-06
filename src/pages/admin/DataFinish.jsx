import React, { useState, useEffect } from "react";
import { database } from "../../config/firebase";
import { ref, get, orderByChild, equalTo } from "firebase/database";
import DataTableFinish from "../../components/DataTableFinish";

const DataFinish = () => {
  const [data, setData] = useState([]);

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
      <h3 className="text-3xl font-bold text-center">Daftar Data Selesai</h3>
      <DataTableFinish data={data} setData={setData} />
    </div>
  );
};

export default DataFinish;
