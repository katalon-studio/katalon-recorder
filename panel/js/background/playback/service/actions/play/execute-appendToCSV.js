import { validateFileName } from "./execute-writeToCSV.js";
import { convertToCSV } from "../../utils/convert-to-CSV.js";

/**
 * append the list of values to the end of data files
 * the number of values must match the number of column in data file
 * @param {String} fileName
 * @param {String[]} values
 * @returns {{result: boolean, errorMessage: string}}
 */
function appendDataFile(fileName, values) {
  let fileData = dataFiles[fileName];
  //data does not guarantee to have attribute data
  if (fileData.data === undefined) {
    parseData(fileName);
  }
  let headers;
  if (fileData.data.length === 0) {
    //the data file content only contains column names
    let rows = fileData.content.split(",");
    if (rows.length !== values.length) {
      return {
        result: false,
        errorMessage: "The amount of data miss match the amount of column in data file"
      }
    }
    headers = rows;
  } else {
    if (Object.keys(fileData.data[0]).length !== values.length) {
      return {
        result: false,
        errorMessage: "The amount of data miss match the amount of column in data file"
      }
    }
    headers = Object.keys(fileData.data[0]);
  }

  let newData = Object.fromEntries(headers.map((_, i) => [headers[i], values[i]]));
  fileData.data.push(newData);
  fileData.content = convertToCSV(fileData.data);
  return { result: true, errorMessage: "" }
}


/**
 * append the value to an existed data file.
 *
 * @param {String} fileName
 * @param {String} value - The value to be appended
 * @returns {{success: boolean, errorMessage: string}}
 */
const executeAppendToCSV = (fileName, value) => {
  let validateResult = validateFileName(fileName);
  if (validateResult.result !== true || dataFiles[fileName] === undefined) {
    return {
      success: false,
      errorMessage: validateResult.errorMessage
    }
  }
  let values = value.split(',');
  let result = appendDataFile(fileName, values);
  if (result.result === true) return { success: true, errorMessage: "" };
  return {
    success: false,
    errorMessage: result.errorMessage
  }

}

export { executeAppendToCSV }