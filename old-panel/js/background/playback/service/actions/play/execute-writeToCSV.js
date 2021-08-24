import { convertToCSV } from "../../utils/convert-to-CSV.js";
import { generateEmptyValueObjectList } from "../../utils/generate-empty-value-object-list.js";

/***
 * check whether the input String "fileName" is a valid CSV file name
 *
 * @param {String} fileName
 * @returns {{result: boolean, errorMessage: string}}
 */
const validateFileName = (fileName) => {
  let regex = new RegExp("^[\\w,\\s-]+\\.[A-Za-z]{3}");
  if (!regex.test(fileName)) {
    return {
      result: false,
      errorMessage: "Invalid file name!"
    }
  }
  let tokens = fileName.split(".");
  let fileType = tokens[tokens.length - 1];
  if (fileType !== "csv") {
    return {
      result: false,
      errorMessage: "Invalid file type! Data file must be a CSV file"
    }
  }
  return { result: true, errorMessage: "" }
}

/***
 * check whether the input String "rowIndex" is a non-negative integer
 * returns result and that integer
 *
 * @param {String} originalRowIndex
 * @returns {{result: boolean, errorMessage: string}|{result: boolean, data: number}}
 */
function validateRowIndex(originalRowIndex) {
  let rowIndex;
  rowIndex = parseInt(originalRowIndex);
  if (isNaN(rowIndex)) {
    return {
      result: false,
      errorMessage: "row_index must be a non-negative number"
    }
  }
  if (rowIndex < 0) {
    return {
      result: false,
      errorMessage: "row_index must be a non-negative number"
    }
  }
  return { result: true, data: rowIndex }
}

/***
 * check whether the input String "columnName" is empty
 *
 * @param {String} columnName
 * @returns {{result: boolean, errorMessage: string}}
 */
function validateColumnName(columnName) {
  if (columnName.trim().length === 0) {
    return {
      result: false,
      errorMessage: "column_name cannot be empty"
    }
  }
  return { result: true, errorMessage: "" }
}

/***
 * parse location with format data_file,row_index,column_name and validate these value
 * Example: data.csv,10,first_name => returns {
 *                                              result: true,
 *                                              data: {
 *                                                fileName: "data.csv",
 *                                                rowIndex: 10,
 *                                                columnName: "first_name"
 *                                               }
 *                                            }
 *
 * @param {String} location
 * @returns {{result: boolean, errorMessage: string} |
 *          {result: boolean, data: {fileName:string, rowIndex: number, columnName:string}}}
 */
function parseLocation(location) {
  let tokens = location.split(',');
  if (tokens.length !== 3) {
    return {
      result: false,
      errorMessage: "Target has incorrect format!"
    }
  }
  let fileName = tokens[0];
  let rowIndex = tokens[1];
  let columnName = tokens[2];

  let validateResult = validateRowIndex(rowIndex);
  if (validateResult.result !== true) {
    return {
      result: false,
      errorMessage: validateResult.errorMessage
    }
  }
  rowIndex = validateResult.data;

  validateResult = validateFileName(fileName);
  if (validateResult.result !== true) {
    return {
      result: false,
      errorMessage: validateResult.errorMessage
    }
  }

  validateResult = validateColumnName(columnName);
  if (validateResult.result !== true) {
    return {
      result: false,
      errorMessage: validateResult.errorMessage
    }
  }

  return {
    result: true,
    data: { fileName, rowIndex, columnName }
  }
}

/**
 * since CSV file uses comma as its main delimiter, if value has comma, surround it with ""
 *
 * @param {string} originValue
 * @returns {string}
 */
function parseValue(originValue) {
  let value = originValue;
  if (/,/.test(originValue)) {
    value = `"${originValue}"`
  }
  return value;
}

/**
 * create a new CSV file with the new data
 *
 * @param {String} fileName
 * @param {number} rowIndex
 * @param {String} columnName
 * @param {String} value
 */
function createNewDataFile(fileName, rowIndex, columnName, value) {
  let data = [];
  //add empty rows up to rowIndex
  data.push(...generateEmptyValueObjectList([columnName], rowIndex + 1));
  data[rowIndex][columnName] = parseValue(value);
  dataFiles[fileName] = {
    type: "csv",
    data: data,
    content: convertToCSV(data)
  };
  saveDataFiles();
}

/***
 * overwrite the existed data file with new data
 *
 * @param {String} fileName
 * @param {number} rowIndex
 * @param {String} columnName
 * @param {String} value
 */
function writeDataFile(fileName, rowIndex, columnName, value) {
  let fileData = dataFiles[fileName];
  //data does not guarantee to have attribute data
  if (fileData.data === undefined) {
    parseData(fileName);
  }
  //user add non-existed column
  if (fileData.data[0][columnName] === undefined) {
    //add empty value of that column for other rows
    for (let data of fileData.data) {
      data[columnName] = "";
    }
  }
  //user add data to non-existed rowIndex
  if (fileData.data[rowIndex] === undefined) {
    let headers = Object.keys(fileData.data[0]);
    let length = fileData.data.length;
    //add empty rows up to rowIndex
    fileData.data.push(...generateEmptyValueObjectList(headers, rowIndex - length + 1));
  }

  fileData.data[rowIndex][columnName] = parseValue(value);
  fileData.content = convertToCSV(fileData.data);
}


/**
 * Write the value to the provided location.
 *
 * @param {String} location - Location of the data inside the CSV file. Structure: data_file,row_index,column_name. Example: data.csv,10,first_name.
 * @param {String} value - The value to be written
 * @returns {{success: boolean, errorMessage: string}}
 */
const executeWriteToCSV = (location, value) => {
  let parseResult = parseLocation(location);
  if (parseResult.result !== true) {
    return {
      success: false,
      errorMessage: parseResult.errorMessage
    }
  }
  let { fileName, rowIndex, columnName } = parseResult.data;
  if (dataFiles[fileName] !== undefined) {
    writeDataFile(fileName, rowIndex, columnName, value);
  } else {
    createNewDataFile(fileName, rowIndex, columnName, value);
  }
  return {
    success: true,
    errorMessage: ""
  }
}

export { executeWriteToCSV, validateFileName }