const saveLog = () => {
  var now = new Date();
  var date = now.getDate();
  var month = now.getMonth() + 1;
  var year = now.getFullYear();
  var seconds = now.getSeconds();
  var minutes = now.getMinutes();
  var hours = now.getHours();
  var f_name = year + '-' + month + '-' + date + '-' + hours + '-' + minutes + '-' + seconds + '.html';
  var logcontext = "";
  var logcontainer = document.getElementById('logcontainer');
  logcontext =
    '<!doctype html>\n' +
    '<html>\n' +
    '<head>\n' +
    '<title>' + f_name + '</title>\n' +
    '<link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,500,700" rel="stylesheet">\n' +
    '<style>\n' +
    '.thumbnail { max-width: 320px; max-height: 200px; }\n' +
    'h4 { font-weight: normal; font-family: \'Roboto Mono\', monospace; font-size: 11px; }\n' +
    'h4.log-info { color: #333333; }\n' +
    'h4.log-error { color: #EA4335; }\n' +
    '</style>\n' +
    '</head>\n' +
    '<body>\n' +
    logcontainer.innerHTML
  '</body>';
  var link = makeTextFile(logcontext);

  var downloading = browser.downloads.download({
    filename: f_name,
    url: link,
    saveAs: true,
    conflictAction: 'overwrite'
  });
}

export { saveLog }