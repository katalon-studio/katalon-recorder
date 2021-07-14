class DataService {
  constructor() {
    this._dataFiles = {};
  }

  setDataFiles(dataFiles) {
    this._dataFiles = dataFiles;
  }

  getDataFiles() {
    return this._dataFiles;
  }

  parseData(name) {
    let dataFile = this._dataFiles[name];
    if (!dataFile.data) {
      let type = dataFile.type;
      if (!type) {
        type = 'csv';
      }
      if (type === 'csv') {
        dataFile.data = Papa.parse(dataFile.content, { header: true }).data;
      } else {
        dataFile.data = JSON.parse(dataFile.content);
      }
    }
    return dataFile;
  }
}


export { DataService }