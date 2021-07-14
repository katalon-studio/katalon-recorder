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
        var tr = renderDataListItem(name);
        list.append(tr);
    }
}

function renderDataListItem(name) {
    var tr = $('<tr></tr>');
    var tdType = $('<td></td>').text( function() {
        var dataFile = dataFiles[name];
        if (!dataFile.data) {
            var type = dataFile.type;
            if (!type) {
                type = 'csv';
            }
            if (type === 'csv') {
                return "CSV";
            } else {
                return "JSON";
            }
        }
    });
    var tdName = $('<td></td>').text(name);
    var tdActions = $('<td></td>');
    var renameButton = $('<button class="rename-button"></button>');
    renameButton.on('click', function() {
        var newName = prompt('Please enter the new name for this data file.', name);
        if (newName.length > 0 && name !== newName) {
            dataFiles[newName] = dataFiles[name];
            delete dataFiles[name];
            saveDataFiles();
        }
    });
    var deleteButton = $('<button class="delete-button"></button>');
    deleteButton.on('click', function() {
        if (confirm('Do you want to remove this data file?')) {
            delete dataFiles[name];
            saveDataFiles();
        }
    });
    let downloadButton = $(`<button class="download-button" value="${name}"></button>`);
    downloadButton.click(function(event){
        let fileName = $(event.target).val();
        let fileContent = "";
        if (dataFiles[fileName].type === "csv"){
            fileContent = "data:text/csv;charset=utf-8," + dataFiles[fileName].content;
        } else if (dataFiles[fileName].type === "json"){
            fileContent = 'data:application/json;charset=utf-8,'+ dataFiles[fileName].content;
        }
        let encodedUri = encodeURI(fileContent);
        let link = document.createElement("a");
        link.setAttribute("id", "123");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        $(link).remove();
    });
    tdActions.append(renameButton, deleteButton, downloadButton);
    tr.append(tdType, tdName, tdActions);
    return tr;
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

$(function() {
    browser.storage.local.get('dataFiles').then(function(result) {
        dataFiles = result.dataFiles;
        if (!dataFiles) {
            dataFiles = {};
        }
        resetDataList();
    });

    var csvInput = $('#load-csv-hidden');
    $('#data-files-add-csv').click(function() {
        csvInput.click();
    });
    var jsonInput = $('#load-json-hidden');
    $('#data-files-add-json').click(function() {
        jsonInput.click();
    });
    document.getElementById("load-csv-hidden").addEventListener("change", function(event) {
        event.stopPropagation();
        for (var i = 0; i < this.files.length; i++) {
            readCsv(this.files[i]);
        }
        this.value = null;
    }, false);
    document.getElementById("load-json-hidden").addEventListener("change", function(event) {
        event.stopPropagation();
        for (var i = 0; i < this.files.length; i++) {
            readJson(this.files[i]);
        }
        this.value = null;
    }, false);
});
