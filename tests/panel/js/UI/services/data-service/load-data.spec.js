import { TestData } from "../../../../../../panel/js/UI/models/test-model/test-data.js";
import {
  mappingDataObjectForTest,
  mappingOldSaveFormatForTest
} from "../../../../../../panel/js/UI/services/data-service/load-data.js";

describe("load-data.js", function () {
  describe("mappingDataObject()", function () {
    beforeEach(function () {
      window.KRData = new TestData();
    });
    it("normal case", function () {
      const dataObj = {
        "testSuites": [
          {
            "id": "fcc3d4c4-54fa-4dea-89a1-30d73207212e",
            "name": "Capture screenshots",
            "testCases": [
              {
                "id": "4b9d9909-1be5-4b59-8447-153fb4a4b729",
                "name": "Capture screenshots",
                "commands": [
                  {
                    "name": "open",
                    "defaultTarget": "https://katalon-test.s3.amazonaws.com/aut/html/form.html",
                    "targets": [
                      "https://katalon-test.s3.amazonaws.com/aut/html/form.html"
                    ],
                    "value": ""
                  },
                  {
                    "name": "captureEntirePageScreenshot",
                    "defaultTarget": "before-adding-comment",
                    "targets": [
                      "before-adding-comment"
                    ],
                    "value": ""
                  },
                  {
                    "name": "click",
                    "defaultTarget": "id=comment",
                    "targets": [
                      "id=comment",
                      "name=comment",
                      "//textarea[@id='comment']",
                      "//form[@id='infoForm']/div[12]/div/textarea",
                      "//textarea",
                      "css=#comment"
                    ],
                    "value": ""
                  },
                  {
                    "name": "type",
                    "defaultTarget": "id=comment",
                    "targets": [
                      "id=comment",
                      "name=comment",
                      "//textarea[@id='comment']",
                      "//form[@id='infoForm']/div[12]/div/textarea",
                      "//textarea",
                      "css=#comment"
                    ],
                    "value": "Added by Alex."
                  },
                  {
                    "name": "captureEntirePageScreenshot",
                    "defaultTarget": "after-adding-comment",
                    "targets": [
                      "after-adding-comment"
                    ],
                    "value": ""
                  }
                ]
              }
            ]
          }
        ]
      }
      mappingDataObjectForTest(dataObj);
      const testSuite = window.KRData.testSuites[0];
      const testCase = testSuite.testCases[0];
      expect(window.KRData.getTestSuiteCount()).toEqual(1);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(testSuite.name).toEqual("Capture screenshots");
      expect(testCase.name).toEqual("Capture screenshots");
      expect(testCase.getTestCommandCount()).toEqual(5);
    });
    it("test suite missing name ", function () {
      const dataObj = {
        "testSuites": [
          {
            "id": "fcc3d4c4-54fa-4dea-89a1-30d73207212e",
            "testCases": [
              {
                "id": "4b9d9909-1be5-4b59-8447-153fb4a4b729",
                "name": "Capture screenshots",
                "commands": [
                  {
                    "name": "open",
                    "defaultTarget": "https://katalon-test.s3.amazonaws.com/aut/html/form.html",
                    "targets": [
                      "https://katalon-test.s3.amazonaws.com/aut/html/form.html"
                    ],
                    "value": ""
                  },
                  {
                    "name": "captureEntirePageScreenshot",
                    "defaultTarget": "before-adding-comment",
                    "targets": [
                      "before-adding-comment"
                    ],
                    "value": ""
                  },
                  {
                    "name": "click",
                    "defaultTarget": "id=comment",
                    "targets": [
                      "id=comment",
                      "name=comment",
                      "//textarea[@id='comment']",
                      "//form[@id='infoForm']/div[12]/div/textarea",
                      "//textarea",
                      "css=#comment"
                    ],
                    "value": ""
                  },
                  {
                    "name": "type",
                    "defaultTarget": "id=comment",
                    "targets": [
                      "id=comment",
                      "name=comment",
                      "//textarea[@id='comment']",
                      "//form[@id='infoForm']/div[12]/div/textarea",
                      "//textarea",
                      "css=#comment"
                    ],
                    "value": "Added by Alex."
                  },
                  {
                    "name": "captureEntirePageScreenshot",
                    "defaultTarget": "after-adding-comment",
                    "targets": [
                      "after-adding-comment"
                    ],
                    "value": ""
                  }
                ]
              }
            ]
          }
        ]
      };
      mappingDataObjectForTest(dataObj);
      const testSuite = window.KRData.testSuites[0];
      const testCase = testSuite.testCases[0];
      expect(window.KRData.getTestSuiteCount()).toEqual(1);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(testSuite.name).toEqual("");
      expect(testCase.name).toEqual("Capture screenshots");
      expect(testCase.getTestCommandCount()).toEqual(5);
    });
    it("test suite missing test cases", function () {
      const dataObj = {
        "testSuites": [
          {
            "id": "fcc3d4c4-54fa-4dea-89a1-30d73207212e",
            "name": "Capture screenshots"
          }
        ]
      };
      mappingDataObjectForTest(dataObj);
      const testSuite = window.KRData.testSuites[0];
      const testCase = testSuite.testCases[0];
      expect(window.KRData.getTestSuiteCount()).toEqual(1);
      expect(testSuite.getTestCaseCount()).toEqual(0);
      expect(testSuite.name).toEqual("Capture screenshots");
      expect(testCase).not.toBeDefined();
    });
    it("test case missing name", function () {
      const dataObj = {
        "testSuites": [
          {
            "id": "fcc3d4c4-54fa-4dea-89a1-30d73207212e",
            "name": "Capture screenshots",
            "testCases": [
              {
                "id": "4b9d9909-1be5-4b59-8447-153fb4a4b729",
                "commands": [
                  {
                    "name": "open",
                    "defaultTarget": "https://katalon-test.s3.amazonaws.com/aut/html/form.html",
                    "targets": [
                      "https://katalon-test.s3.amazonaws.com/aut/html/form.html"
                    ],
                    "value": ""
                  },
                  {
                    "name": "captureEntirePageScreenshot",
                    "defaultTarget": "before-adding-comment",
                    "targets": [
                      "before-adding-comment"
                    ],
                    "value": ""
                  },
                  {
                    "name": "click",
                    "defaultTarget": "id=comment",
                    "targets": [
                      "id=comment",
                      "name=comment",
                      "//textarea[@id='comment']",
                      "//form[@id='infoForm']/div[12]/div/textarea",
                      "//textarea",
                      "css=#comment"
                    ],
                    "value": ""
                  },
                  {
                    "name": "type",
                    "defaultTarget": "id=comment",
                    "targets": [
                      "id=comment",
                      "name=comment",
                      "//textarea[@id='comment']",
                      "//form[@id='infoForm']/div[12]/div/textarea",
                      "//textarea",
                      "css=#comment"
                    ],
                    "value": "Added by Alex."
                  },
                  {
                    "name": "captureEntirePageScreenshot",
                    "defaultTarget": "after-adding-comment",
                    "targets": [
                      "after-adding-comment"
                    ],
                    "value": ""
                  }
                ]
              }
            ]
          }
        ]
      };
      mappingDataObjectForTest(dataObj);
      const testSuite = window.KRData.testSuites[0];
      const testCase = testSuite.testCases[0];
      expect(window.KRData.getTestSuiteCount()).toEqual(1);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(testSuite.name).toEqual("Capture screenshots");
      expect(testCase.name).toEqual("");
    });
    it("test case missing commands", function () {
      const dataObj = {
        "testSuites": [
          {
            "id": "fcc3d4c4-54fa-4dea-89a1-30d73207212e",
            "name": "Capture screenshots",
            "testCases": [
              {
                "id": "4b9d9909-1be5-4b59-8447-153fb4a4b729",
                "name": "Capture screenshots"
              }
            ]
          }
        ]
      };
      mappingDataObjectForTest(dataObj);
      const testSuite = window.KRData.testSuites[0];
      const testCase = testSuite.testCases[0];
      expect(window.KRData.getTestSuiteCount()).toEqual(1);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(testSuite.name).toEqual("Capture screenshots");
      expect(testCase.name).toEqual("Capture screenshots");
      expect(testCase.getTestCommandCount()).toEqual(0);
    });
  });

  describe("mappingOldSaveFormat()", function () {
    beforeEach(function () {
      window.KRData = new TestData();
    });
    it("normal case", function () {
      const dataObj = [
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n<head>\n\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n\t<title>Capture screenshots</title>\n</head>\n<body>\n<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n<thead>\n<tr><td rowspan=\"1\" colspan=\"3\">Capture screenshots</td></tr>\n</thead>\n<tbody>\n<tr><td>open</td><td>https://katalon-test.s3.amazonaws.com/aut/html/form.html<datalist><option>https://katalon-test.s3.amazonaws.com/aut/html/form.html</option></datalist></td><td></td>\n</tr>\n<tr><td>captureEntirePageScreenshot</td><td>before-adding-comment<datalist><option>before-adding-comment</option></datalist></td><td></td>\n</tr>\n<tr><td>click</td><td>id=comment<datalist><option>id=comment</option><option>name=comment</option><option>//textarea[@id='comment']</option><option>//form[@id='infoForm']/div[12]/div/textarea</option><option>//textarea</option><option>css=#comment</option></datalist></td><td></td>\n</tr>\n<tr><td>type</td><td>id=comment<datalist><option>id=comment</option><option>name=comment</option><option>//textarea[@id='comment']</option><option>//form[@id='infoForm']/div[12]/div/textarea</option><option>//textarea</option><option>css=#comment</option></datalist></td><td>Added by Alex.</td>\n</tr>\n<tr><td>captureEntirePageScreenshot</td><td>after-adding-comment<datalist><option>after-adding-comment</option></datalist></td><td></td>\n</tr>\n</tbody></table>\n</body>\n</html>"
      ]
      mappingOldSaveFormatForTest(dataObj);
      const testSuite = window.KRData.testSuites[0];
      const testCase = testSuite.testCases[0];
      expect(window.KRData.getTestSuiteCount()).toEqual(1);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(testSuite.name).toEqual("Capture screenshots");
      expect(testCase.name).toEqual("Capture screenshots");
      expect(testCase.getTestCommandCount()).toEqual(5);
    });


  });
})