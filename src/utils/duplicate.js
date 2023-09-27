export function hasDuplicateByName(data) {
  const uniqueNames = new Set();
  const uniqueObjects = [];

  for (const item of data) {
    const name = item.name;

    if (!uniqueNames.has(name)) {
      uniqueNames.add(name);
      uniqueObjects.push(item);
    }
  }

  return uniqueObjects;
}
