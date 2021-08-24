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
        var tr = renderExtensionsListItem(name, i);
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


function renderExtensionListContextMenu(id, name){

    function renderRenameListItem(oldName){
        const rename = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", "#");
        a.textContent = "Rename";
        rename.appendChild(a);
        rename.addEventListener("click", function(event) {
            event.stopPropagation();
            const newName = prompt('Please enter the new name for this extension script.', oldName);
            if (newName.length > 0 && oldName !== newName) {
                extensions[newName] = extensions[oldName];
                delete extensions[oldName];
                resetExtensionsList();
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
            let fileContent = "data:text/javascript;charset=utf-8," + extensions[name].content;
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
            if (confirm('Do you want to remove this extension script?')) {
                delete extensions[name];
                resetExtensionsList();
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


function renderExtensionsListItem(name, index) {
    const id = "extension" + index;
    const div = document.createElement('div');
    div.classList.add("extension-item");
    div.id = id;

    const imageDiv = document.createElement('div');
    imageDiv.classList.add("extensionIcon");
    const img = document.createElement('img');
    img.src = "/katalon/images/SVG/paper-icon.svg";
    imageDiv.append(img);
    div.appendChild(imageDiv);

    const titleDiv = document.createElement("div");
    titleDiv.innerHTML = name;
    div.append(titleDiv);

    const contextMenu = renderExtensionListContextMenu(id, name);
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

function extensionScriptContainerOpen(){
    const image = $("#extensionDropdown").find("img");
    const src = $(image).attr("src");
    if (src.includes("off")) {
        $(image).attr("src", "/katalon/images/SVG/dropdown-arrow-on.svg");
        $("#extensions-list").css("display", "flex");
    }
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
        extensionScriptContainerOpen();
        this.value = null;
    }, false);
});
