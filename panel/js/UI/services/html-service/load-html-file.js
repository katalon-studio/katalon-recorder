import { unmarshall } from "../helper-service/parser.js";

/**
 * read HTML file and parse it to model object
 * @param file - File object represent HTML KR save files
 * @returns {Promise<TestSuite>}
 */
const loadHTMLFile = (file) => {
  return new Promise((resolve, reject) => {
    if (file.type !== "text/html") reject("Wrong file format");
    const reader = new FileReader();
    if (!file.name.includes("htm")) return;
    reader.readAsText(file);

    reader.onload = function () {
      let testSuiteHTMLString = reader.result;
      //testSuiteHTMLString = testSuiteHTMLString.split("\n").map(line => line.trim()).join("");
      let suiteName;
      if (file.name.lastIndexOf(".") >= 0) {
        suiteName = file.name.substring(0, file.name.lastIndexOf("."));
      } else {
        suiteName = file.name;
      }
      try {
        const testSuite = unmarshall(suiteName, testSuiteHTMLString);
        resolve(testSuite);
      } catch (error) {
        reject(error);
      }

    };
    reader.onerror = function (e) {
      console.log("Error", e);
    };
  });
}

export { loadHTMLFile }

