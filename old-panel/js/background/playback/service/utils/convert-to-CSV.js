/***
 * convert an JS array to CSV String
 *
 * @param {*[]} objArray
 * @returns {string}
 */
const convertToCSV = (objArray) => {
  let str = '';
  str += Object.keys(objArray[0]).join(",") + '\r\n';
  for (let i = 0; i < objArray.length; i++) {
    str += Object.values(objArray[i]).join(",") + '\r\n';
  }
  return str;
}

export { convertToCSV }