var extensions;

function readExtension(f) {
    var reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function(event) {
        extensions[f.name] = {
            content: reader.result,
            type: 'Extension'
        };      
        saveExtensions();
    }
}

function saveExtensions() {
    browser.storage.local.set({
        extensions: extensions
    });
    resetExtensionsList();
}

function resetExtensionsList() {
    var list = $('#extensions-list');
    list.empty();
    var names = Object.keys(extensions).sort();
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var tr = renderExtensionsListItem(name);
        list.append(tr);
    }

    // execute extension script to add command to Selenium
    Object.keys(extensions).forEach(function(extensionFileName){
        var newFunction = new Function(extensions[extensionFileName].content);
        newFunction();        
    });

    // GUI reload list of commands
    $("#command-dropdown,#command-command-list").html(genCommandDatalist());
}

function renderExtensionsListItem(name) {
    var tr = $('<tr></tr>');
    var tdType = $('<td></td>').text('JavaScript');
    var tdName = $('<td></td>').text(name);
    var tdActions = $('<td></td>');
    var renameButton = $('<button class="rename-button"></button>');
    renameButton.on('click', function() {
        var newName = prompt('Please enter the new name for this extension script.', name);
        if (newName.length > 0 && name !== newName) {
            extensions[newName] = extensions[name];
            delete extensions[name];
            saveExtensions();
        }
    });
    var deleteButton = $('<button class="delete-button"></button>');
    deleteButton.on('click', function() {
        if (confirm('Do you want to remove this extension script?')) {
            delete extensions[name];
            saveExtensions();
        }
    });
    tdActions.append(renameButton, deleteButton);
    tr.append(tdType, tdName, tdActions);
    return tr;
}

$(function() {
    browser.storage.local.get('extensions').then(function(result) {
        extensions = result.extensions;
        if (!extensions) {
            extensions = {};
        }
        resetExtensionsList();
    });

    var extensionInput = $('#load-extension-hidden');
    $('#extension-add').click(function() {
        extensionInput.click();
    });
    document.getElementById("load-extension-hidden").addEventListener("change", function(event) {
        event.stopPropagation();
        for (var i = 0; i < this.files.length; i++) {
            readExtension(this.files[i]);
        }
        this.value = null;
    }, false);
});
