import { TestData } from "../../../../../../panel/js/UI/models/test-model/test-data.js";
import {
  addSampleData,
  sampleData
} from "../../../../../../panel/js/UI/services/sample-project-service/sample-project-service.js";

describe("sample-project-service.js", function () {
  describe("addSampleData()", function () {
    beforeEach(function () {
      window.dataFiles = {};
      window.KRData = new TestData();
      window.saveDataFiles = function(){};
    })
    it("add normal sample data without data", function () {
      const sampleData = [{
        testSuiteName: "Capture screenshots",
        projectName: "Capture screenshots",
        description: "Capture the screenshot of an entire page",
        testSuite: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
  <title>Capture screenshots</title>
</head>
<body>
<table cellpadding="1" cellspacing="1" border="1">
  <thead>
  <tr><td rowspan="1" colspan="3">Capture screenshots</td></tr>
  </thead>
  <tbody>
  <tr><td>open</td><td>https://katalon-test.s3.amazonaws.com/aut/html/form.html<datalist><option>https://katalon-test.s3.amazonaws.com/aut/html/form.html</option></datalist></td><td></td>
  </tr>
  <tr><td>captureEntirePageScreenshot</td><td>before-adding-comment<datalist><option>before-adding-comment</option></datalist></td><td></td>
  </tr>
  <tr><td>click</td><td>id=comment<datalist><option>id=comment</option><option>name=comment</option><option>//textarea[@id='comment']</option><option>//form[@id='infoForm']/div[12]/div/textarea</option><option>//textarea</option><option>css=#comment</option></datalist></td><td></td>
  </tr>
  <tr><td>type</td><td>id=comment<datalist><option>id=comment</option><option>name=comment</option><option>//textarea[@id='comment']</option><option>//form[@id='infoForm']/div[12]/div/textarea</option><option>//textarea</option><option>css=#comment</option></datalist></td><td>Added by Alex.</td>
  </tr>
  <tr><td>captureEntirePageScreenshot</td><td>after-adding-comment<datalist><option>after-adding-comment</option></datalist></td><td></td>
  </tr>
  </tbody></table>
</body>
</html>`,
      }]
      const sampleTestSuites = addSampleData(sampleData, [0]);
      expect(sampleTestSuites.length).toEqual(1);
    });

    it("add normal sample data with data", function () {
      const sampleData = [{
        testSuiteName: "storeCSV sample",
        projectName: "Read and use values from a CSV file.",
        description: "Read the number of lines, a value at a particular row and column, compute values from different cells. ",
        testSuite: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
          "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
          "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
          "<head>\n" +
          "\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
          "\t<title>storeCSV sample</title>\n" +
          "</head>\n" +
          "<body>\n" +
          "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
          "<thead>\n" +
          "<tr><td rowspan=\"1\" colspan=\"3\">storeCSV sample</td></tr>\n" +
          "</thead>\n" +
          "<tbody>\n" +
          "<tr><td>storeCsv</td><td>data.csv,0,first<datalist><option>data.csv,2,firstName</option><option>data.csv,0,firstName</option><option>data.csv,0,first</option></datalist></td><td>firstName</td>\n" +
          "</tr>\n" +
          "<tr><td>echo</td><td>${firstName}<datalist><option>${firstName}</option></datalist></td><td></td>\n" +
          "</tr>\n" +
          "<tr><td>storeCsv</td><td>data.csv<datalist><option>data.csv,0,first</option><option>data.csv,2,firstName</option><option>data.csv,0,firstName</option><option>data.csv</option></datalist></td><td>dataCSV</td>\n" +
          "</tr>\n" +
          "<tr><td>storeEval</td><td>dataCSV.length<datalist><option>data.csv,0,first</option><option>data.csv,2,firstName</option><option>data.csv,0,firstName</option><option>dataCSV.length</option></datalist></td><td>dataLength</td>\n" +
          "</tr>\n" +
          "<tr><td>echo</td><td>${dataLength}<datalist><option>dataLength</option><option>${dataLength}</option></datalist></td><td></td>\n" +
          "</tr>\n" +
          "<tr><td>storeEval</td><td>dataCSV[\"first\"][0]<datalist><option>dataCsv[\"first\"][0]</option><option>dataCSV[\"first\"][0]</option></datalist></td><td>firstName</td>\n" +
          "</tr>\n" +
          "<tr><td>echo</td><td>${firstName}<datalist><option>firstName</option><option>${firstName}</option></datalist></td><td></td>\n" +
          "</tr>\n" +
          "<tr><td>storeEval</td><td>dataCSV[\"first\"][0] + dataCSV[\"last\"][0]<datalist><option>dataCSV[\"first\"][0] + dataCSV[\"last\"][0]</option></datalist></td><td>fullName</td>\n" +
          "</tr>\n" +
          "<tr><td>echo</td><td>fullName<datalist><option>fullName</option></datalist></td><td></td>\n" +
          "</tr>\n" +
          "<tr><td>store</td><td>0<datalist><option>fullName</option><option>3</option><option>0</option></datalist></td><td>i</td>\n" +
          "</tr>\n" +
          "<tr><td>storeEval</td><td>dataCSV[\"first\"][${i}] + dataCSV[\"last\"][${i}]<datalist><option>dataCSV[\"first\"][0] + dataCSV[\"last\"][0]</option><option>dataCSV[\"first\"][${i}] + dataCSV[\"last\"][${i}]</option></datalist></td><td>fullName</td>\n" +
          "</tr>\n" +
          "<tr><td>echo</td><td>${fullName}<datalist><option>fullName</option><option>${fullName}</option></datalist></td><td></td>\n" +
          "</tr>\n" +
          "</tbody></table>\n" +
          "</body>\n" +
          "</html>",
        data: {
          "data.csv": {
            "content": "first,last\nAlex,Smith\nSteve,Rogers\nBruce,Wayne",
            "type": "csv"
          }
        }
      }]
      const sampleTestSuites = addSampleData(sampleData, [0]);
      expect(sampleTestSuites.length).toEqual(1);
      expect(dataFiles["data.csv"].content).toEqual("first,last\nAlex,Smith\nSteve,Rogers\nBruce,Wayne");
      expect(dataFiles["data.csv"].type).toEqual("csv");
    });

    it("pass null or undefined sampleData", function () {
      expect(function () {
        const { sampleTestSuites, sideex_ids } = addSampleData(null, [0, 1, 2, 3]);
      }).toThrow("Null or undefined sampleData");
      expect(function () {
        const { sampleTestSuites, sideex_ids } = addSampleData(undefined, [0, 1, 2, 3]);
      }).toThrow("Null or undefined sampleData");
    });

    it("pass null or undefined selectedSampleIndexes", function () {
      expect(function () {
        const { sampleTestSuites, sideex_ids } = addSampleData(sampleData, null);
      }).toThrow("Null or undefined selectedSampleIndexes");
      expect(function () {
        const { sampleTestSuites, sideex_ids } = addSampleData(sampleData,);
      }).toThrow("Null or undefined selectedSampleIndexes");
    });

    it("pass wrong not existed index in selectedSampleIndexes", function () {
      const sampleTestSuites = addSampleData(sampleData, [-1, 100]);
      expect(sampleTestSuites.length).toEqual(0);
    });

  });
})
