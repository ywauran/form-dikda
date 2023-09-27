// Compare two data arrays and find the differences
export function compareData(data1, data2) {
  const differences = [];

  // Check for items in data1 that are not in data2
  for (const item1 of data1) {
    if (
      !data2.some((item2) => JSON.stringify(item1) === JSON.stringify(item2))
    ) {
      differences.push({
        message: "Item in data is not in data1",
        item: item1,
      });
    }
  }

  // Check for items in data2 that are not in data1
  for (const item2 of data2) {
    if (
      !data1.some((item1) => JSON.stringify(item2) === JSON.stringify(item1))
    ) {
      differences.push({
        message: "Item in data1 is not in data",
        item: item2,
      });
    }
  }

  return differences;
}

export function compareArrays(data1, data2) {
  // Mengonversi array ke Set untuk operasi set
  const set1 = new Set(data1.map((item) => item.name));
  const set2 = new Set(data2.map((item) => item.name));

  // Membuat array yang hanya berisi objek yang ada di data1, tapi tidak di data2
  const uniqueData1 = data1.filter((item) => !set2.has(item.name));

  // Membuat array yang hanya berisi objek yang ada di data2, tapi tidak di data1
  const uniqueData2 = data2.filter((item) => !set1.has(item.name));

  return { uniqueData1, uniqueData2 };
}

// // Memanggil fungsi compareArrays
// const { uniqueData1, uniqueData2 } = compareArrays(data1, data2);

// // Menampilkan hasil
// console.log("Data yang hanya ada di data1:");
// console.log(uniqueData1);

// console.log("Data yang hanya ada di data2:");
// console.log(uniqueData2);
