const appendCaseToGrid = (testCase) => {
  let recordGridContent = generateRecordGridHTML(testCase);
  if (recordGridContent) {
    clean_panel();
    document.getElementById("records-grid").innerHTML = escapeHTML(recordGridContent);

    let count = getRecordsNum();
    if (count !== '0') {
      reAssignId("records-1", "records-" + count);
      for (let i = 1; i <= count; ++i) {
        // do not forget that textNode is a childNode
        for (let j = 0; j < 3; ++j) {
          let node = document.getElementById("records-" + i).getElementsByTagName("td")[j];
          let adjust = unescapeHtml(node.childNodes[0].innerHTML);
          node.childNodes[1].appendChild(document.createTextNode(adjust));
        }
      }
      attachEvent(1, count);
    }
  } else {
    clean_panel();
  }
  let id = "case" + sideex_testCase.count;
  sideex_testCase.count++;
  let records = document.getElementById("records-grid").innerHTML;
  let case_title = testCase.name;
  sideex_testCase[id] = {
    records: records,
    title: case_title
  };
  addTestCase(case_title, id);
}

function generateHTMLOptionList(options) {
  return options.reduce((output, option) => {
    return output + `<option>${option[0]}</option>`
  }, "");
}

function generateRecordGridHTML(testCase) {
  let output = "";
  testCase.commands.forEach(command => {
    let htmlOptionList = generateHTMLOptionList(command.targets);
    let new_tr = '<tr>' + '<td><div style="display: none;">' + command.command + '</div><div style="overflow:hidden;height:15px;"></div></td>' + '<td><div style="display: none;">' + command.target +
      '</div><div style="overflow:hidden;height:15px;"></div>\n        ' + '<datalist>' + htmlOptionList + '</datalist>' + '</td>' +
      '<td><div style="display: none;">' + command.value + '</div><div style="overflow:hidden;height:15px;"></div></td>' + '</tr>';
    output = output + new_tr;
  });

  output = '<input id="records-count" value="' + ((!testCase.commands) ? 0 : testCase.commands.length) + '" type="hidden">' + output;
  return output;
}

export { appendCaseToGrid };