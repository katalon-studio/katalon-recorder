/***
 * remove object in array at indexes
 *
 * @param {*[]} array - target array
 * @param {*[]} indexArray
 * @returns {*}
 */
const removeObjectAtIndexes = (array, indexArray) => {
  array = JSON.parse(JSON.stringify(array));
  for (let i = 0; i < indexArray.length; i++) {
    let index = indexArray[i] - i;
    array.splice(index, 1)
  }
  return array;
}

/***
 * generate UUID version 4
 *
 * @returns {string}
 */
const generateUUID = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export { removeObjectAtIndexes, generateUUID }