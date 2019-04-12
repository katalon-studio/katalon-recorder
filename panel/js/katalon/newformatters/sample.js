newFormatters.sample = function(name, commands) {
  var content = '';
  for (var i = 0; i < commands.length; i++) {
    var command = commands[i];
    content += command.command + ' | ' + command.target + ' | ' + command.value + '\n';
  }
  return {
    content: content,
    extension: 'txt',
    mimetype: 'text/plain'
  }
}