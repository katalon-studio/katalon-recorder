/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

// KAT runScript command
function katalonSendMessage(result) {
	window.postMessage({
		direction: "from-page-runscript",
		result: result
	}, "*");
}

function katalonRunScript(script) {
	var result;
	try {
		var scriptResult = script();
		result = {
			status: true,
			result: scriptResult
		}
	} catch (e) {
		var message = 'Error: ' + e.toString();
		result = {
			status: false,
			result: message
		}
	}
	katalonSendMessage(result);
}

window.addEventListener("message", function(event) {
	if (event.source == window && event.data && event.data.direction == "from-content-runscript") {
		isWanted = true;
		var doc = window.document;
		var scriptTag = doc.createElement("script");
		scriptTag.type = "text/javascript"
		scriptTag.text = 'katalonRunScript(function() {' + event.data.script + ';})';
		doc.body.appendChild(scriptTag);
	}
});
