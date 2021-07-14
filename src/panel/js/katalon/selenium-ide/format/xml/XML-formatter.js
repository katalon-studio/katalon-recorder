/*
BSD Licence

Copyright (c) 2010, Thibault ROHMER
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of the creator nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

//----------

Selenium IDE XML Formatter

Developper: Thibault ROHMER

Possible Enhancements:
-Internationalization
-Test suite xml
-Indent with tabs or spaces
-No CDATA if empty (smaller XML file)

//-----------------
History:

1.5:
	-Firefox 4 compatibility

1.4:
	-BaseURL is setted if defined in XML file
	-Code quality enhanced:
		->XML output is constructed properly wether indentation is active or not
		->XML clipboard output is also constructed correctly with the same function
	
1.3:
	-Add baseURL attribute for rootTag element

1.2:
	-Fix preferences issue (were set to '' each time you press ok & not working after first install)
	
1.1:
	-Added attribute seleniumIDEVersion
	-Removed attribute name
1.0:
	-Initial release
*/

/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source)
{
	var parser = new DOMParser(); // https://developer.mozilla.org/en/DOMParser
	var doc = null;
	try
	{
		doc = parser.parseFromString(source, 'text/xml');
		
		if(doc.documentElement && doc.documentElement.nodeName == 'parsererror') // https://bugzilla.mozilla.org/show_bug.cgi?id=45566
			throw 'Parse error';
	}
	catch(err)
	{
		throw "Can't parse XML file, XML not well-formed?";
	}
	
	// Set BaseURL if defined in XML file
	if(doc.documentElement && doc.documentElement.hasAttribute('baseURL'))
	{
		var rootNode = doc.documentElement;
		editor.app.setBaseURL(rootNode.getAttribute('baseURL'));
	}
	
	// Read XML with an XPath in order to get <selenese> and comments in the good order
	var xpath = '//'+options.seleneseTag+'|//comment()';
	var nodes = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
	var current = nodes.iterateNext();
	
	var commands = [];	
	while(current)
	{
		if(current.nodeName == options.seleneseTag)
		{
			var command = new Command();
			
			// Get Data from XML
			command.command = current.children[0].textContent; // 0 -> command
			command.target = current.children[1].textContent; // 1 -> target
			command.value = current.children[2].textContent; // 2 -> value
			
			commands.push(command);
		}
		else if(current.nodeType == Node.COMMENT_NODE)
		{
			var comment = new Comment();
			comment.comment = current.textContent;
			commands.push(comment);
		}
		current = nodes.iterateNext();
	}
	
	if(commands.length > 0)
	{
		testCase.commands = commands;
	}
	else
	{
		// Don't throw an exception, just warn
		alert('No command found');
	}
}

/**
 * Format TestCase and return the source.
 *
 * @param testCase TestCase to format
 * @param name The name of the test case, if any. It may be used to embed title into the source.
 */
function format(testCase, name)
{	
	var dom = getDOMForCommands(testCase.commands);
	
	var s = new XMLSerializer(); // https://developer.mozilla.org/en/XMLSerializer
	var docXML = s.serializeToString(dom);
	
	var text = '<?xml version="1.0" encoding="UTF-8"?>';
	if(options.indentWithTab == 'true') text += '\n'
	text += docXML;
	
	return text;
}

/**
 * Format an array of commands to the snippet of source.
 * Used to copy the source into the clipboard.
 *
 * @param The array of commands to sort.
 */
function formatCommands(commands)
{
	var dom = getDOMForCommands(commands);
	
	var s = new XMLSerializer(); // https://developer.mozilla.org/en/XMLSerializer
	var docXML = s.serializeToString(dom);
	
	return docXML;
}

//-----

// Return a DOM object describing the test case, composed of `commands`
function getDOMForCommands(commands)
{
	// Create a new DOM element
	var namespaceURI = null;
	var qualifiedNameStr = null;
	var DocumentType = null;
	var dom = document.implementation.createDocument(namespaceURI, qualifiedNameStr, DocumentType); // https://developer.mozilla.org/En/DOM/DOMImplementation.createDocument
	
	// Create root element
	var t = dom.createElement(options.rootTag);
	
	// Add version attribute
	// var tName = dom.createAttribute('seleniumIDEVersion');
	// tName.nodeValue = Editor.getString('selenium-ide.version');
	// t.setAttributeNode(tName);
	
	// Add baseURL attribute
	// tName = dom.createAttribute('baseURL');
	// tName.nodeValue = editor.getBaseURL(); // Request base url from editor
	// t.setAttributeNode(tName);
	
	for(i = 0; i < commands.length; i++)
	{
		if(options.indentWithTab == 'true') t.appendChild(dom.createTextNode('\n'));
		
		if(commands[i].type == 'comment')
		{
			var textComment = dom.createComment(commands[i].comment);
			t.appendChild(textComment);
		}
		else if(commands[i].type == 'command')
		{
			// Create a Selenese node
			var selenese = dom.createElement(options.seleneseTag);
				
				var selCommand = dom.createElement(options.commandTag);
				var selTarget = dom.createElement(options.targetTag);
				var selValue = dom.createElement(options.valueTag);
				
				var nodeCommand = dom.createTextNode(commands[i].command);
				var nodeTarget = dom.createCDATASection(commands[i].target);
				var nodeValue = dom.createCDATASection(commands[i].value);
				
				selCommand.appendChild(nodeCommand);
				selTarget.appendChild(nodeTarget);
				selValue.appendChild(nodeValue);
			
			if(options.indentWithTab == 'true')
			{
				// For each tag, create a new line and indent a single tab
				selenese.appendChild(dom.createTextNode('\n\t'));
				selenese.appendChild(selCommand);
				selenese.appendChild(dom.createTextNode('\n\t'));
				selenese.appendChild(selTarget);
				selenese.appendChild(dom.createTextNode('\n\t'));
				selenese.appendChild(selValue);
				
				// Put the end tag (</selenese>) on a new line
				selenese.appendChild(dom.createTextNode('\n'));
			}
			else
			{
				selenese.appendChild(selCommand);
				selenese.appendChild(selTarget);
				selenese.appendChild(selValue);
			}
			t.appendChild(selenese);
		}
	}
	
	// Put the end tag (</TestCase>) on a new line
	if(options.indentWithTab == 'true') t.appendChild(dom.createTextNode('\n'));
	
	dom.appendChild(t);
	
	return dom;
}

// Will be stored in extensions.selenium-ide.formats.xmlformatter.
this.options =
{
    rootTag: 'TestCase',
	seleneseTag: 'selenese',
	commandTag: 'command',
	targetTag: 'target',
	valueTag: 'value',
	indentWithTab: 'true'
};

// Optional: XUL XML String for the UI of the options dialog
this.configForm = 
	'<description>Root Tag</description>' +
	'<textbox id="options_rootTag" />' +
	'<description>Selenese Tag</description>' +
	'<textbox id="options_seleneseTag" />' +
	'<description>Command Tag</description>' +
	'<textbox id="options_commandTag" />' +
	'<description>Target Tag</description>' +
	'<textbox id="options_targetTag" />' +
	'<description>Value Tag</description>' +
	'<textbox id="options_valueTag" />' +
	'<separator class="groove"/>' +
	'<checkbox id="options_indentWithTab" label="Indent XML with tabulations" />';
