var serverPort = (bowser.name == "Chrome") ? katalonServerPortForChrome : katalonServerPortForFirefox;
var qAutomate_server_url = KATALON_SERVER_URL_PREFIX + serverPort + KATALON_SERVER_URL_SUFFIX;   
function initKatalonServerUrl(port) {
    qAutomate_server_url = KATALON_SERVER_URL_PREFIX + port + KATALON_SERVER_URL_SUFFIX;
}
getKatalonServerPort(initKatalonServerUrl);