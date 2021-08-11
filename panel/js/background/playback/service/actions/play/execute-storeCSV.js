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

/**
 * parse location with format data_file,row_index,column_name or data_file and validate these values
 * Example: data.csv,10,first_name => returns {
 *                                              result: true,
 *                                              data: {
 *                                                fileName: "data.csv",
 *                                                rowIndex: 10,
 *                                                columnName: "first_name"
 *                                               }
 *                                            }
 * Example: data.csv => returns {
 *                                result: true,
 *                                data: {
 *                                   fileName: "data.csv",
 *                                   rowIndex: undefined,
 *                                   columnName: undefined
 *                                }
 *                               }
 * @param location
 * @returns {{result: boolean, errorMessage: string}|{result: boolean, data: {fileName, rowIndex, columnName}}}
 */
function parseLocation(location) {
  let tokens = location.split(',');
  if (tokens.length !== 3 && tokens.length !== 1) {
    return {
      result: false,
      errorMessage: "Target has incorrect format!"
    }
  }
  let fileName = tokens[0];
  let rowIndex;
  let columnName;
  //location with format data_file,row_index,column_name
  if (tokens.length === 3) {
    rowIndex = tokens[1];
    columnName = tokens[2];

    let validateResult = validateRowIndex(rowIndex);
    if (validateResult.result !== true) {
      return {
        result: false,
        errorMessage: validateResult.errorMessage
      }
    }
    rowIndex = validateResult.data;

    validateResult = validateColumnName(columnName);
    if (validateResult.result !== true) {
      return {
        result: false,
        errorMessage: validateResult.errorMessage
      }
    }
  }

  return {
    result: true,
    data: { fileName, rowIndex, columnName }
  }
}

/**
 * parse data from CSV file and get cell value at specific row and column
 * @param {String} fileName - CSV file name
 * @param {Number} rowIndex - cell's row
 * @param {String} columnName - cell's column name
 * @returns {String}
 */
function getCellValue(fileName, rowIndex, columnName) {
  return parseData(fileName).data[rowIndex][columnName]
}


/**
 * parse CSV file and return an Object contains data from that CSV file.
 * the return object will have the following format
 * {
 *   "column_name_1": [row_1_value, row_2_value, ....],
 *   "column_name_2": [row_1_value, row_2_value, ....],
 *   ....
 *   length: Number
 * }
 * @param {String} fileName - CSV file name
 * @returns {Object}
 */
function getCSVData(fileName) {
  let fileData = dataFiles[fileName];
  if (dataFiles[fileName].data === undefined) {
    parseData(fileName);
  }

  let csvData = fileData.data.reduce((obj, row) => {
    for (const [key, value] of Object.entries(row)) {
      if (obj[key]) {
        obj[key].push(value);
      } else {
        obj[key] = [value];
      }
    }
    return obj;
  }, {});
  csvData.length = fileData.data.length;
  return csvData;
}


const executeStoreCSV = (location, value) => {
  if (!value || value.trim().length === 0) {
    return {
      success: false,
      errorMessage: "Variable name can not be empty!",
      successMessage: ""
    }
  }
  if (!location || location.trim().length === 0) {
    return {
      success: false,
      errorMessage: "Location cannot be empty!",
      successMessage: ""
    }
  }
  let parseResult = parseLocation(location);
  if (parseResult.result !== true) {
    return {
      success: false,
      errorMessage: parseResult.errorMessage,
      successMessage: ""
    }
  }
  let { fileName, rowIndex, columnName } = parseResult.data;
  if (dataFiles[fileName] === undefined) {
    return {
      success: false,
      errorMessage: "Data file does not exist!",
      successMessage: ""
    }
  }
  if (rowIndex || columnName) { //old command with format data_file,row_index,column_name
    const csvValue = getCellValue(fileName, rowIndex, columnName);
    declaredVars[value] = csvValue;
    return {
      success: true,
      errorMessage: "",
      successMessage: `Store ${csvValue} into ${value}`
    }
  }

  declaredVars[value] = getCSVData(fileName);
  return {
    success: true,
    errorMessage: "",
    successMessage: `Store ${fileName} into ${value}`
  }
}

export { executeStoreCSV }