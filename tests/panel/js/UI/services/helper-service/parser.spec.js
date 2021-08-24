import { marshall, unmarshall } from "../../../../../../panel/js/UI/services/helper-service/parser.js"
import { TestSuite } from "../../../../../../panel/js/UI/models/test-model/test-suite.js";
import { TestCase } from "../../../../../../panel/js/UI/models/test-model/test-case.js";
import { TestCommand } from "../../../../../../panel/js/UI/models/test-model/test-command.js";

describe("parser.spec.js", function () {
  describe("unmarshall()", function () {
    it("unmarshall normal case", function () {
      const suiteName = "Normal case";
      const HTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "\t<title>DragAndDropJQuery</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">DragAndDropJQuery</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>https://jqueryui.com/resources/demos/droppable/default.html<datalist><option>https://jqueryui.com/resources/demos/droppable/default.html</option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "<tr><td>dragAndDropToObjectByJqueryUI</td><td>id=draggable<datalist><option>id=droppable</option><option>xpath=//div[@id='droppable']</option><option>xpath=//div[3]</option><option>css=#droppable</option><option>id=draggable</option></datalist></td><td>id=droppable</td>\n" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>"
      const testSuite = unmarshall(suiteName, HTMLString);
      const firstTestCase = testSuite.testCases[0];
      const firstCommand = firstTestCase.commands[0];
      const secondCommand = firstTestCase.commands[1];
      expect(testSuite.name).toEqual("Normal case");
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(firstTestCase.name).toEqual("DragAndDropJQuery");
      expect(firstTestCase.getTestCommandCount()).toEqual(2);
      expect(firstCommand.name).toEqual("open");
      expect(firstCommand.defaultTarget).toEqual("https://jqueryui.com/resources/demos/droppable/default.html");
      expect(firstCommand.targets).toEqual(["https://jqueryui.com/resources/demos/droppable/default.html"]);
      expect(firstCommand.value).toEqual("");
      expect(secondCommand.name).toEqual("dragAndDropToObjectByJqueryUI");
      expect(secondCommand.defaultTarget).toEqual("id=draggable");
      expect(secondCommand.targets).toEqual(["id=droppable", "xpath=//div[@id='droppable']", "xpath=//div[3]", "css=#droppable", "id=draggable"]);
      expect(secondCommand.value).toEqual("id=droppable");
    });
    it("unmarshall empty name", function () {
      const suiteName = "Empty name";
      const HTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "\t<title>DragAndDropJQuery</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">DragAndDropJQuery</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>https://jqueryui.com/resources/demos/droppable/default.html<datalist><option>https://jqueryui.com/resources/demos/droppable/default.html</option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "<tr><td>dragAndDropToObjectByJqueryUI</td><td>id=draggable<datalist><option>id=droppable</option><option>xpath=//div[@id='droppable']</option><option>xpath=//div[3]</option><option>css=#droppable</option><option>id=draggable</option></datalist></td><td>id=droppable</td>\n" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      const testSuite = unmarshall(suiteName, HTMLString);
      expect(testSuite.name === "");
      expect(testSuite).not.toBeNull();
    })
    it("unmarshall empty HTMl String", function () {
      const suiteName = "empty HTMl String";
      const HTMLString = "";
      expect(function () {
        unmarshall(suiteName, HTMLString)
      }).toThrow("Incorrect format");
    });
    it("unmarshall corrupted HTML String", function () {
      const suiteName = "corrupted HTML String";
      const HTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "\t<title>DragAndDropJQuery</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>https://jqueryui.com/resources/demos/droppable/default.html<datalist><option>https://jqueryui.com/resources/demos/droppable/default.html</option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      expect(function () {
        unmarshall(suiteName, HTMLString)
      }).toThrow("Incorrect format");
    });
    it("unmarshall empty test case", function () {
      const suiteName = "empty test case";
      const HTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "\t<title>normal test suite</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">normal test case</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      const testSuite = unmarshall(suiteName, HTMLString);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      expect(testSuite.testCases[0].getTestCommandCount()).toEqual(0);
    });
    it("unmarshall empty target test case", function(){
      const suiteName = "delay";
      const HTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "\t<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "\t<title>Delay</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">Delay</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>https://katalon-test.s3.amazonaws.com/aut/html/form.html<datalist><option>https://katalon-test.s3.amazonaws.com/aut/html/form.html</option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "<tr><td>echo</td><td>1<datalist><option>1</option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "<tr><td>pause</td><td><datalist><option>10000</option><option>5000</option><option></option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "<tr><td>echo</td><td>2<datalist><option>2</option></datalist></td><td></td>\n" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      const testSuite = unmarshall(suiteName, HTMLString);
      expect(testSuite.getTestCaseCount()).toEqual(1);
      const testCase = testSuite.testCases[0];
      expect(testCase.commands[2].name).toEqual("pause");
      expect(testCase.commands[2].defaultTarget).toEqual("");
      expect(testCase.commands[2].value).toEqual("");

    });


  });
  describe("marshall()", function () {
    it('marshall normal case', function () {
      const testSuite = new TestSuite("normal test suite");
      const testCase = new TestCase("normal test case");
      const testCommand = new TestCommand("open", "www.google.com", ["www.google.com", "www.yahoo.com"], "");
      testCase.commands.push(testCommand);
      testSuite.testCases.push(testCase);
      const actualHTMLString = marshall(testSuite);
      const expectedHTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "<title>normal test suite</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">normal test case</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>www.google.com<datalist><option>www.google.com</option><option>www.yahoo.com</option></datalist></td><td></td>" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      expect(actualHTMLString).toEqual(expectedHTMLString);
    });
    it("marshall empty test suite name", function () {
      const testSuite = new TestSuite();
      const testCase = new TestCase("normal test case");
      const testCommand = new TestCommand("open", "www.google.com", ["www.google.com", "www.yahoo.com"], "");
      testCase.commands.push(testCommand);
      testSuite.testCases.push(testCase);
      const actualHTMLString = marshall(testSuite);
      const expectedHTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "<title></title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">normal test case</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>www.google.com<datalist><option>www.google.com</option><option>www.yahoo.com</option></datalist></td><td></td>" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      expect(actualHTMLString).toEqual(expectedHTMLString);
    })
    it("marshall empty test case name", function () {
      const testSuite = new TestSuite("normal test suite");
      const testCase = new TestCase();
      const testCommand = new TestCommand("open", "www.google.com", ["www.google.com", "www.yahoo.com"], "");
      testCase.commands.push(testCommand);
      testSuite.testCases.push(testCase);
      const actualHTMLString = marshall(testSuite);
      const expectedHTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "<title>normal test suite</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\"></td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "<tr><td>open</td><td>www.google.com<datalist><option>www.google.com</option><option>www.yahoo.com</option></datalist></td><td></td>" +
        "</tr>\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      expect(actualHTMLString).toEqual(expectedHTMLString);
    })
    it("marshall empty test case", function () {
      const testSuite = new TestSuite("normal test suite");
      const testCase = new TestCase("normal test case");
      testSuite.testCases.push(testCase);
      const actualHTMLString = marshall(testSuite);
      const expectedHTMLString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n" +
        "<head>\n" +
        "<meta content=\"text/html; charset=UTF-8\" http-equiv=\"content-type\" />\n" +
        "<title>normal test suite</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<table cellpadding=\"1\" cellspacing=\"1\" border=\"1\">\n" +
        "<thead>\n" +
        "<tr><td rowspan=\"1\" colspan=\"3\">normal test case</td></tr>\n" +
        "</thead>\n" +
        "<tbody>\n" +
        "\n" +
        "</tbody></table>\n" +
        "</body>\n" +
        "</html>";
      expect(actualHTMLString).toEqual(expectedHTMLString);
    })
  });
})