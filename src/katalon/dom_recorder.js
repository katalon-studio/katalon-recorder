// TODO: Remove dom_recorder.js entirely ? 
function startRecord(version) {
    ku_recorder.attach(version);    
    /* rec_setupEventListeners();
    rec_createInfoDiv();

    // for Firefox
    if (!detectChrome() && !detectIE() && !(typeof self === 'undefined')) {
        self.on('message', function(message) {
            if (message.kind == "postSuccess") {
                console.log("POST recorded element successful")
            } else if (message.kind == "postFail") {
                alert(message.text);
            }
        });
    } */
};


function endRecord() {
    ku_recorder.detach();
    /* rec_disposeEventListeners();
    rec_removeInfoDiv();
    rec_clearHoverElement();
    rec_navigateActionRecorded = false; */
}
