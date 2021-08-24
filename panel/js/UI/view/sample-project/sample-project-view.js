import { sampleData } from "../../services/sample-project-service/sample-data.js";
import { sampleDataCategories } from "../../services/sample-project-service/sample-data-categories.js";
import { unmarshall } from "../../services/helper-service/parser.js";

function renderProjectSampleTitle(index) {
  const div = document.createElement("div");
  div.id = `sampleProject-${index}`
  const input = document.createElement("input");
  input.type = "checkbox";
  $(input).change(function(event){
    if ($(".sample-projects input:checked").length > 0){
      $("#main-panel-add-sample").removeClass("disable").addClass("enable");
    } else {
      $("#main-panel-add-sample").removeClass("enable").addClass("disable");
    }

  })
  const title = document.createElement("div");
  title.innerHTML = sampleData[index].projectName;
  div.append(input);
  div.append(title);

  $(div).click(function () {
    //add selected class for current sample project
    for (let i = 0; i < sampleData.length; i++) {
      $(`#sampleProject-${i}`).removeClass("selected");
    }
    $(this).addClass("selected");
    //get information of selected sample project
    //element has id as sampleProject-0
    const index = parseInt(this.id.substring(14));
    const data = sampleData[index];
    const testSuite = unmarshall(data.testSuiteName, data.testSuite);
    const testCase = testSuite.testCases[0];

    //display description
    $("#sample-section .description").html(`<span>Description:</span> ${data.description}`)

    //display sample project to sample-records-grid
    const sampleRecordGrid = $("#sample-records-grid");
    $(sampleRecordGrid).empty();
    for (const testCommand of testCase.commands){
      let row = document.createElement("tr");
      let command = document.createElement("td");
      command.innerHTML = testCommand.name;
      let target = document.createElement("td");
      target.innerHTML = testCommand.defaultTarget;
      let value = document.createElement("td");
      value.innerHTML = testCommand.value;
      row.appendChild(command);
      row.appendChild(target);
      row.appendChild(value);
      debugger;
      $(sampleRecordGrid).append(row);
    }

  });
  return div;
}

function sampleProjectDropdownOn(dropdownElement) {
  const image = $(dropdownElement).find("img");
  $(image).attr("src", "/katalon/images/SVG/dropdown-keyboard-arrow-on.svg");
  const categoryContainer = dropdownElement.parentElement.parentElement;
  const sampleProjects = $(categoryContainer).find(".sample-projects")[0];
  $(sampleProjects).css("display", "flex");
}

function sampleProjectDropDownOff(dropdownElement){
  const image = $(dropdownElement).find("img");
  $(image).attr("src", "/katalon/images/SVG/dropdown-keyboard-arrow-off.svg");
  const categoryContainer = dropdownElement.parentElement.parentElement;
  const sampleProjects = $(categoryContainer).find(".sample-projects")[0];
  $(sampleProjects).css("display", "none");
}
const htmlString = `
    <div class="container">
        <div class="left-side">
          
        </div>
      <div class="right-side">
        <div class="description">
            Click on each automation template to review its content!
        </div>
        <div id="sample-command-grid-container">
            <table id="sample-command-grid" class="tablesorter" cellspacing="0">
              <thead class="fixed">
              <tr>
                  <th style="width: 23%">Command</th>
                  <th style="width: 52%">Target</th>
                  <th style="width: 25%">Value</th>
              </tr>
              </thead>
              <tbody id="sample-records-grid">
                  
              </tbody>
            </table>
        </div>
        <div class="footer">
            <button id="main-panel-sample-cancel">Cancel</button>
            <button class="disable" id="main-panel-add-sample">Add templates</button>
        </div>
      </div>
    </div>
    
    `

function renderSampleCategories() {
  $("<div id='sample-section'></div>")
    .html(htmlString)
    .dialog({
      autoOpen: true,
      dialogClass: 'sampleDialog',
      resizable: true,
      height: "440",
      width: "752",
      modal: true,
      draggable: false,
      open: function(){
        $('.ui-widget-overlay').addClass("dim-overlay");
      }
    }).parent()
    .draggable();
  $(window).trigger('resize');

  $("#sample-section").dialog('close');


  const sampleSection = $("#sample-section .left-side")[0];

  for (const [categoryName, category] of Object.entries(sampleDataCategories)) {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("sample-category");
    sampleSection.appendChild(categoryContainer);

    const categoryTitle = document.createElement("div");
    categoryTitle.classList.add("category-title");
    categoryContainer.appendChild(categoryTitle);

    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    let img = document.createElement("img");
    img.src = "/katalon/images/SVG/dropdown-keyboard-arrow-off.svg";
    dropdown.appendChild(img);
    categoryTitle.append(dropdown);

    const icon = document.createElement("div");
    icon.classList.add("icon");
    img = document.createElement("img");
    img.src = category.iconURL;
    icon.appendChild(img);
    categoryTitle.append(icon);

    const title = document.createElement("div");
    title.classList.add("title");
    title.innerHTML = categoryName;
    categoryTitle.appendChild(title);



    $(dropdown).click(function () {
      const image = $(this).find("img");
      const src = $(image).attr("src");
      if (src.includes("off")) {
        sampleProjectDropdownOn(this);
      } else {
        sampleProjectDropDownOff(this);
      }
    });

    const sampleProjectContainer = document.createElement("div");
    sampleProjectContainer.classList.add("sample-projects");
    for (const sampleProjectID of category.sampleProjectIDs) {
      const sampleProject = renderProjectSampleTitle(sampleProjectID);
      sampleProjectContainer.appendChild(sampleProject);
    }
    categoryContainer.appendChild(sampleProjectContainer);
  }
}

const resetSampleProjectDialog = () => {
  $(".sample-projects input").prop("checked",false);
  [...$("#sample-section .dropdown")].forEach(element => sampleProjectDropDownOff(element));
  [...$("#sample-section .selected")].forEach(element => $(element).removeClass("selected"));
  $("#sample-records-grid").empty();
  $("#sample-section .description").html(`Click on each automation template to review its content!`)
}

export { renderSampleCategories, resetSampleProjectDialog }