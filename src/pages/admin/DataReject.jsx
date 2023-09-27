import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../config/firebase";
import DataTableReject from "../../components/user/DataTableReject";
import { hasDuplicateByName } from "../../utils/duplicate";

const DataReject = () => {
  const [dataReject, setDataReject] = useState([]);
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

        data.reverse();
        setDataReject(hasDuplicateByName(data));
      } else {
        console.log("No data available.");
      }
    } catch (error) {
      console.error("Error querying data:", error);
      throw error;
    }
  };

  useEffect(() => {
    queryDataReject();
  }, []);

  return (
    <>
      <DataTableReject data={dataReject} setData={setDataReject} />
    </>
  );
};

export default DataReject;
