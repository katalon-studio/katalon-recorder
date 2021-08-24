import { TestSuite } from "../../../../../../panel/js/UI/models/test-model/test-suite.js";
import { TestCase } from "../../../../../../panel/js/UI/models/test-model/test-case.js";
import { TestCommand } from "../../../../../../panel/js/UI/models/test-model/test-command.js";
import { TestData } from "../../../../../../panel/js/UI/models/test-model/test-data.js";
import {
  addTestSuite,
  createTestSuite,
  deleteTestSuite
} from "../../../../../../panel/js/UI/services/data-service/test-suite-service.js";

describe("test-suite-service.js", function () {
  describe("deleteTestSuite()", function () {
    beforeEach(function () {
      const testSuite = new TestSuite("normal test suite");
      testSuite.id = "123";
      const testCase = new TestCase("normal case");
      const testCommand1 = new TestCommand("open", "www.google.com", ["www.google.com"], "");
      const testCommand2 = new TestCommand("type", "name=q", ["xpath=//input[@name='q']", "name=q"], "");
      testCase.commands.push(testCommand1);
      testCase.commands.push(testCommand2);
      testSuite.testCases.push(testCase);

      window.KRData = new TestData([testSuite]);
    });

    it("normal case", function () {
      const KRDataID = "123";
      const deletedTestSuite = deleteTestSuite(KRDataID);
      expect(KRData.getTestSuiteCount()).toEqual(0);
      expect(deletedTestSuite.id).toEqual(KRDataID);
    });


    it("pass non existed KRDataID", function () {
      const KRDataID = "abc";
      const deletedTestSuite = deleteTestSuite(KRDataID);
      expect(deletedTestSuite).not.toBeDefined();
    });


    it("pass null KRDataID", function () {
      const KRDataID = null;
      expect(function () {
        deleteTestSuite(KRDataID);
      }).toThrow("Null or undefined testSuiteID");
    });

    it("pass undefined KRDataID", function () {
      const KRDataID = undefined;
      expect(function () {
        deleteTestSuite(KRDataID);
      }).toThrow("Null or undefined testSuiteID");
    });

    it("pass both undefined sideex_id and KRDataID", function () {
      expect(function () {
        deleteTestSuite();
      }).toThrow();
    });

  });

  describe("createTestSuite()", function () {
    beforeEach(function () {
      window.KRData = new TestData();
    });

    it("create normal suite", function () {
      const testSuite  = createTestSuite("normal suite");
      expect(testSuite.name).toEqual("normal suite");
      expect(KRData.getTestSuiteCount()).toEqual(1);
    });

    it("pass null test suite name", function () {
      const testSuite  = createTestSuite(null);
      expect(testSuite.name).toEqual("Untitled Test Suite");
      expect(KRData.getTestSuiteCount()).toEqual(1);
    });

    it("pass undefined test suite name", function () {
      const testSuite  = createTestSuite(undefined);
      expect(testSuite.name).toEqual("Untitled Test Suite");
      expect(KRData.getTestSuiteCount()).toEqual(1);
    });

  });

  describe("addTestSuite", function () {
    beforeEach(function () {
      const testSuite = new TestSuite("normal test suite");
      testSuite.id = "123";
      const testCase = new TestCase("normal case");
      const testCommand1 = new TestCommand("open", "www.google.com", ["www.google.com"], "");
      const testCommand2 = new TestCommand("type", "name=q", ["xpath=//input[@name='q']", "name=q"], "");
      testCase.commands.push(testCommand1);
      testCase.commands.push(testCommand2);
      testSuite.testCases.push(testCase);

      window.KRData = new TestData([testSuite]);
    });

    it("add normal suite", function () {
      const testSuite = new TestSuite("normal test suite");
      addTestSuite(testSuite);
      expect(KRData.getTestSuiteCount()).toEqual(2);
    });

    it("pass null test suite", function () {
      expect(function(){
        const sideex_id = addTestSuite(null);
      }).toThrow("Null or undefined test suite");
    });

    it("pass undefined test suite", function () {
      expect(function(){
        const sideex_id = addTestSuite();
      }).toThrow("Null or undefined test suite");
    });
  })
})