var dataFiles;

function readCsv(f) {
    var reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function(event) {
        dataFiles[f.name] = {
            content: reader.result,
            type: 'csv'
        };
        saveDataFiles();
    }
}

function readJson(f) {
    var reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function(event) {
        dataFiles[f.name] = {
            content: reader.result,
            type: 'json'
        };
        saveDataFiles();
    }
}

function saveDataFiles() {
    browser.storage.local.set({
        dataFiles: dataFiles
    });
    resetDataList();
}

function resetDataList() {
    var list = $('#data-files-list');
    list.empty();
    var names = Object.keys(dataFiles).sort();
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var tr = renderDataListItem(name, i);
        list.append(tr);
    }
}




function renderDataListContextMenu(id, name){

    function renderRenameListItem(oldName){
        const rename = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", "#");
        a.textContent = "Rename";
        rename.appendChild(a);
        rename.addEventListener("click", function(event) {
            event.stopPropagation();
            const newName = prompt('Please enter the new name for this data file.', oldName);
            if (newName.length > 0 && oldName !== newName) {
                dataFiles[newName] = dataFiles[oldName];
                delete dataFiles[oldName];
                saveDataFiles();
            }
        }, false);
        return rename;
    }

    function renderDownloadListItem(name){
        const download = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", "#");
        a.textContent = "Download";
        download.appendChild(a);
        download.addEventListener("click", function(event) {
            event.stopPropagation();
            let fileContent = "";
            if (dataFiles[name].type === "csv"){
                fileContent = "data:text/csv;charset=utf-8," + dataFiles[name].content;
            } else if (dataFiles[name].type === "json"){
                fileContent = 'data:application/json;charset=utf-8,'+ dataFiles[name].content;
            }
            let encodedUri = encodeURI(fileContent);
            let link = document.createElement("a");
            link.setAttribute("id", "123");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
            $(link).remove();
        }, false);
        return download;
    }

    function renderDeleteListItem(name){
        const deleteItem = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", "#");
        a.textContent = "Delete";
        deleteItem.appendChild(a);
        deleteItem.addEventListener("click", function(event) {
            event.stopPropagation();
            if (confirm('Do you want to remove this data file?')) {
                delete dataFiles[name];
                saveDataFiles();
            }
        }, false);
        return deleteItem;
    }

    const menu = document.createElement("div");
    menu.setAttribute("class", "menu");
    menu.setAttribute("id", "menu" + id);

    const rename = renderRenameListItem(name);
    const download = renderDownloadListItem(name);
    const deleteItem = renderDeleteListItem(name);
    const list = document.createElement("ul");

    list.appendChild(rename);
    list.appendChild(download);
    list.appendChild(deleteItem);

    menu.appendChild(list)
    return menu;
}

function renderDataListItem(name, index) {
    const id = "data" + index;
    const div = document.createElement('div');
    div.classList.add("data-item");
    div.id = id;

    const imageDiv = document.createElement('div');
    imageDiv.classList.add("dataIcon");
    const img = document.createElement('img');
    img.src = "/katalon/images/SVG/paper-icon.svg";
    imageDiv.append(img);
    div.appendChild(imageDiv);

    const titleDiv = document.createElement("div");
    titleDiv.innerHTML = name;
    div.append(titleDiv);

    const contextMenu = renderDataListContextMenu(id, name);
    div.append(contextMenu);
    addContextMenuButton(id, div, contextMenu, "data");
    div.addEventListener("contextmenu", function(event){
        event.preventDefault();
        event.stopPropagation();
        var mid = "#" + "menu" + id;
        $(".menu").css("left", event.pageX);
        $(".menu").css("top", event.pageY);
        $(mid).show();
    })
    return div;
}

function parseData(name) {
    var dataFile = dataFiles[name];
    if (!dataFile.data) {
        var type = dataFile.type;
        if (!type) {
            type = 'csv';
        }
        if (type === 'csv') {
            dataFile.data = Papa.parse(dataFile.content, { header: true }).data;
        } else {
            dataFile.data = JSON.parse(dataFile.content);
        }
    }
    return dataFile;
}

function testDataContainerOpen(){
    const image = $("#testDataDropdown").find("img");
    const src = $(image).attr("src");
    if (src.includes("off")) {
        $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-on.svg");
        $("#data-files-list").css("display", "flex");
    }
}

$(function() {
    browser.storage.local.get('dataFiles').then(function(result) {
        dataFiles = result.dataFiles;
        if (!dataFiles) {
            dataFiles = {};
        }
        resetDataList();
    });
    document.getElementById("load-data-file-hidden").addEventListener("change", function(event) {
        event.stopPropagation();
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].type === "text/csv"){
                readCsv(this.files[i]);
            } else {
                readJson(this.files[i]);
            }
        }
        testDataContainerOpen();
        this.value = null;
    }, false);
});
