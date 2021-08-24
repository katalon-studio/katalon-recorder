import {
  createTestCase,
  deleteTestCase
} from "../../../../../../panel/js/UI/services/data-service/test-case-service.js";
import { TestData } from "../../../../../../panel/js/UI/models/test-model/test-data.js";
import { TestSuite } from "../../../../../../panel/js/UI/models/test-model/test-suite.js";
import { TestCase } from "../../../../../../panel/js/UI/models/test-model/test-case.js";
import { TestCommand } from "../../../../../../panel/js/UI/models/test-model/test-command.js";

describe("test-case-service.js", function () {
  describe("createTestCase()", function () {
    beforeEach(function () {
      window.KRData = new TestData();
    });

    it("create normal case", function () {
      const testSuite = new TestSuite("normal suite");
      const testCase  = createTestCase("normal case", testSuite);
      expect(testCase.name).toEqual("normal case");
      expect(testSuite.getTestCaseCount()).toEqual(1);
    });

    it("pass null test case name", function () {
      const testSuite = new TestSuite("normal suite");
      const testCase  = createTestCase(null, testSuite);
      expect(testCase.name).toEqual("Untitled Test Case");
      expect(testSuite.getTestCaseCount()).toEqual(1);
    });

    it("pass undefined test case name", function () {
      const testSuite = new TestSuite("normal suite");
      const testCase = createTestCase(undefined, testSuite);
      expect(testCase.name).toEqual("Untitled Test Case");
      expect(testSuite.getTestCaseCount()).toEqual(1);
    });

    it("pass null test suite", function () {
      expect(function () {
        createTestCase("normal case", null);
      }).toThrow("Null or undefined test suite");
    });

    it("pass undefined test suite", function () {
      expect(function () {
        createTestCase("normal case");
      }).toThrow("Null or undefined test suite");
    });

    it("pass undefined test suite and undefined test case name", function () {
      expect(function () {
        createTestCase();
      }).toThrow();
    });

  });

  describe('deleteTestCase()', function () {
    beforeEach(function () {
      const testSuite = new TestSuite("normal test suite");
      const testCase = new TestCase("normal case");
      testCase.id = "123";
      const testCommand1 = new TestCommand("open", "www.google.com", ["www.google.com"], "");
      const testCommand2 = new TestCommand("type", "name=q", ["xpath=//input[@name='q']", "name=q"], "");
      testCase.commands.push(testCommand1);
      testCase.commands.push(testCommand2);
      testSuite.testCases.push(testCase);

      window.KRData = new TestData([testSuite]);
    });

    it("normal case", function(){
      const KRDataID = "123";
      deleteTestCase(KRDataID);
      expect(KRData.testSuites[0].getTestCaseCount()).toEqual(0);
    });

    it("pass non existed KRDataID", function(){
      const KRDataID = "abc";
      const deletedTestCase = deleteTestCase(KRDataID);
      expect(deletedTestCase).not.toBeDefined();
    });

    it("pass null KRDataID", function(){
      const KRDataID = null;
      expect(function () {
        deleteTestCase(KRDataID);
      }).toThrow("Null or undefined testCaseID");
    });

    it("pass undefined KRDataID", function(){
      const KRDataID = undefined;
      expect(function () {
        deleteTestCase(KRDataID);
      }).toThrow("Null or undefined testCaseID");
    });

  })
})