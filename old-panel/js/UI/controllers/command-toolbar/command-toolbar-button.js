import {
    generateAddCommand,
    generateCopyCommand,
    generateDeleteSelectedCommand,
    generatePasteCommand,
    generateRedoCommand,
    generateUndoCommand
} from "../../services/records-grid/command-generators.js";


$(function() {
    $('#grid-add-btn').attr('title', "Add new test step");
    $('#grid-delete-btn').attr('title', "Delete the current test steps");
    $('#grid-copy-btn').attr('title', "Copy the current test steps");
    $('#grid-paste-btn').attr('title', "Paste the copied test steps as the next step of the current one");
    $('#grid-undo-btn').attr('title', "Undo");
    $('#grid-redo-btn').attr('title', "Redo");


    $('#grid-add-btn').on('click', function(event) {
        const addCommand = generateAddCommand();
        addCommand.execute();
    });

    $('#grid-delete-btn').on('click', function(event) {
        const deleteSelected = generateDeleteSelectedCommand();
        deleteSelected.execute();
    });

    $('#grid-copy-btn').on('click', function(event) {
        const copyCommand = generateCopyCommand();
        copyCommand.execute();
    });

    $('#grid-paste-btn').on('click', function(event) {
        const pasteCommand = generatePasteCommand();
        pasteCommand.execute();
    });

    $('#grid-undo-btn').on('click', function(event) {
        const undoCommand = generateUndoCommand();
        undoCommand.execute();
    });

    $('#grid-redo-btn').on('click', function(event) {
        const redoCommand = generateRedoCommand();
        redoCommand.execute();
    });
});