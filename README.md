# Katalon Recorder

## How to add new formatter

Add to `panel\index.html` (replace `sample` with the formatter name):

```
<option value="new-formatter-sample">Sample for new formatters</option>
```

Sample implementation:
```
panel\js\katalon\newformatters\sample.js
```

References:
* Implement New Relic Synthetics formatter #16
* Add protractor typescript template #23

## Resources

https://github.com/katalon-studio/katalon-recorder-helper

https://github.com/katalon-studio/katalon-recorder-samples

https://github.com/katalon-studio/katalon-recorder-sample-plugin

## For Mozilla Reviewers

The file `atoms.js` was built from https://github.com/SeleniumHQ/selenium/tree/selenium-3.141.59.

Build steps:
```
./go build
./go //javascript/selenium-atoms
# output: build/javascript/selenium-atoms/selenium-atoms.js
```

The use of CSP and eval is necessary for a record & playback tool (including inject JavaScript PER user commands). There is no other way to do this so please don't disable our add on again.

## Acknowledgments

We would like to take this opportunity to express our warmest thanks to Katalon Recorder users and other open-source projects, especially:

* Selenium IDE Project - [http://www.seleniumhq.org](http://www.seleniumhq.org/).

* SideeX - https://github.com/SideeX/sideex.

* Robot Framework Formatter Project - https://github.com/ngocbv/Robot-Framework-Formatter.

* Formatter for C# with MSTest is provided by [Mark Gibson](https://forum.katalon.com/discussion/4209/export-to-c-with-webdriver-and-mstest).

* @[Patrick Groot](https://github.com/pgroot91), @Piotr, @Mark_Gibson and other active members who have provided a lot of valuable suggestions and bug reports. Please forgive us if your name is missing here.

* Plugin developers:

  * Jan Esser - PHPUnit formatter for Katalon Recorder ([Chrome](https://chrome.google.com/webstore/detail/phpunit-formatter-for-kat/gelokgfkbnkkcdbokielchgpfnphoalk?utm_source=chrome-ntp-icon))

  * Sam Kirkland - Puppeteer exporter for Katalon Recorder (https://github.com/SamKirkland/Puppeteer-exporter-for-Katalon-Recorder)

## License

Refer to NOTICE and KATALON RECORDER CONTRIBUTION LICENSE AGREEMENT for Katalon Recorder.

Refer to APACHE LICENSE 2.0 for SideeX.

Please inform us if you found any unlicensed part of source code.

## Companion products

### Katalon TestOps

[Katalon TestOps](https://analytics.katalon.com) is a web-based application that provides dynamic perspectives and an insightful look at your automation testing data. You can leverage your automation testing data by transforming and visualizing your data; analyzing test results; seamlessly integrating with such tools as Katalon Studio and Jira; maximizing the testing capacity with remote execution.

* Read our [documentation](https://docs.katalon.com/katalon-analytics/docs/overview.html).
* Ask a question on [Forum](https://forum.katalon.com/categories/katalon-analytics).
* Request a new feature on [GitHub](CONTRIBUTING.md).
* Vote for [Popular Feature Requests](https://github.com/katalon-analytics/katalon-analytics/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc).
* File a bug in [GitHub Issues](https://github.com/katalon-analytics/katalon-analytics/issues).

### Katalon Studio
[Katalon Studio](https://www.katalon.com) is a free and complete automation testing solution for Web, Mobile, and API testing with modern methodologies (Data-Driven Testing, TDD/BDD, Page Object Model, etc.) as well as advanced integration (JIRA, qTest, Slack, CI, Katalon TestOps, etc.). Learn more about [Katalon Studio features](https://www.katalon.com/features/).
