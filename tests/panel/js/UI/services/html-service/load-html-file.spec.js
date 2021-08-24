import { loadHTMLFile } from "../../../../../../panel/js/UI/services/html-service/load-html-file.js";


describe("load-html-file.js", function () {
  it("load normal file", async function () {
    let blob = new Blob(["<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
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
    "</html>"], { type: 'text/html' });
    blob["lastModifiedDate"] = "";
    blob["name"] = "DragAndDropJQuery.html";
    const testsuite = await loadHTMLFile(blob);
    const firstTestCase = testsuite.testCases[0];
    const firstCommand = firstTestCase.commands[0];
    const secondCommand = firstTestCase.commands[1];
    expect(testsuite.name).toEqual("DragAndDropJQuery");
    expect(testsuite.getTestCaseCount()).toEqual(1);
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
  it("load empty file", async function () {
    let blob = new Blob([""], { type: 'text/html' });
    blob["lastModifiedDate"] = "";
    blob["name"] = "empty.html";
    try{
      const testsuite = await loadHTMLFile(blob);
    } catch (error){
      expect(error).toEqual("Incorrect format");
    }
  });
  it("load wrong file type", async function(){
    let blob = new Blob([""], { type: 'text/txt' });
    blob["lastModifiedDate"] = "";
    blob["name"] = "empty.txt";
    try{
      const testsuite = await loadHTMLFile(blob);
    } catch (error){
      expect(error).toEqual("Wrong file format");
    }
  });

  it("load corrupted file", async function(){
    let blob = new Blob(["<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
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
    "</html>"], { type: 'text/html' });
    blob["lastModifiedDate"] = "";
    blob["name"] = "corrupted.html";
    try{
      const testsuite = await loadHTMLFile(blob);
    } catch (error){
      expect(error).toEqual("Incorrect format");
    }
  });
})