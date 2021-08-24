/***
 * generates a array with empty value objects
 *
 * @param {String[]} keys - list of keys that belong to array's object.
 * @param {number} n - length of the array
 * @returns {Object[]}
 */
const generateEmptyValueObjectList = (keys, n) => {
  if (n < 0) throw "Invalid length";
  let result = []
  for (let i = 0; i < n; i++) {
    let temp = keys.reduce((obj, key) => {
      obj[key] = "";
      return obj;
    }, {});
    result.push(temp);
  }
  return result;
}

export { generateEmptyValueObjectList }