console.log("Spec loaded for test page");

function getTextFromNote(element, addSpace) {
  return "Testing";
}

describe("common.js", function () {
  it("should be able to get text from element", function () {
    let elementText = getTextFromNote(
      document.getElementById("testing-id"),
      false
    );
    expect(elementText).toEqual("Testing");
  });
});
