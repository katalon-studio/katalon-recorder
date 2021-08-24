const genCommandDatalist = () => {
  var supportedCommand = _loadSeleniumCommands();

  var datalistHTML = "";
  formalCommands = {};
  supportedCommand.forEach(function(command) {
    datalistHTML += ('<option value="' + command + '">' + command + '</option>\n');
    formalCommands[command.toLowerCase()] = command;
  });

  return datalistHTML;
}

export { genCommandDatalist }
