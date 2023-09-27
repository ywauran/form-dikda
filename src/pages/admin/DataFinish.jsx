import React, { useState, useEffect } from "react";
import { database } from "../../config/firebase";
import { ref, get } from "firebase/database";
import DataTableFinish from "../../components/DataTableFinish";
import { hasDuplicateByName } from "../../utils/duplicate";
import { compareArrays } from "../../utils/compareData";

const DataFinish = () => {
  const [dataFinish, setDataFinish] = useState([]);
  const [dataReject, setDataReject] = useState([]);

  const queryData = async () => {
    try {
      const dataRef = ref(database, "data");
      const dataRejectRef = ref(database, "dataReject");

      const [snapshotData, snapshotDataReject] = await Promise.all([
        get(dataRef),
        get(dataRejectRef),
      ]);

      const data = [];
      const dataReject = [];
      if (snapshotData.exists()) {
        snapshotData.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          if (item.isFinish === true) {
            data.push(item);
          }
        });
      } else {
        console.log("No data available.");
      }

      if (snapshotDataReject.exists()) {
        snapshotDataReject.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          dataReject.push(item);
        });

        const result = compareArrays(data, dataReject);
        setDataFinish(hasDuplicateByName(result.uniqueData1));
        setDataReject(hasDuplicateByName(result.uniqueData2));
      } else {
        console.log("No dataReject available.");
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
      <DataTableFinish data={dataFinish} setData={setDataFinish} />
    </div>
  );
};

export default DataFinish;
