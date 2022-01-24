<h1 align="center">
<a href="https://www.katalon.com/katalon-recorder-ide/" target="blank_">
    <img width=70% src="https://github.com/katalon-studio/docs-images/raw/master/katalon-recorder/docs/product-logos/Core-Katalon_Recorder.png" alt="Katalon Recorder Logo" />
</a>
</h1>

**Katalon Recorder** is a free, Selenium IDE alternative, lightweight web extension for automating actions and automated testing on the browser. Currently, we are available on **Chrome**, **Firefox** and **Edge**.

## Installation

To install Katalon Recorder on your desired browser, visit our website: [Katalon Recorder](https://www.katalon.com/katalon-recorder-ide/).
## Documentation

For instructions on using Katalon Recorder, visit our documentation website: [Full documentation](https://docs.katalon.com/katalon-recorder/docs/overview.html).

## Community and support

* Visit the [Documentation website](https://docs.katalon.com/katalon-recorder/docs/overview.html).
* Ask questions on the [Katalon Community](https://forum.katalon.com/) forum.
* Create [Github Issues](https://github.com/katalon-studio/katalon-recorder/issues) for bug reports and feature requests.

## Configurations
### Adding a new formatter

To add a new formatter, go to `panel\index.html`, and replace "sample" with the formatter name:

```html
<option value="new-formatter-sample">Sample for new formatters</option>
```

For sample implementation, see: `panel\js\katalon\newformatters\sample.js`

### Resources

* [Katalon Recorder Helper](https://github.com/katalon-studio/katalon-recorder-helper).

* [Sample Test Cases](https://github.com/katalon-studio/katalon-recorder-samples).

* [Sample Katalon Recorder Plugin](https://github.com/katalon-studio/katalon-recorder-sample-plugin).

## Acknowledgments

We would like to take this opportunity to express our warmest thanks to Katalon Recorder users and other open-source projects, especially:

* [Selenium IDE](http://www.seleniumhq.org/).

* [SideeX](https://github.com/SideeX/sideex).

* [Robot Framework Formatter Project](https://github.com/ngocbv/Robot-Framework-Formatter).

* Formatter for C# with MSTest is provided by [Mark Gibson](https://forum.katalon.com/discussion/4209/export-to-c-with-webdriver-and-mstest).

* [@Patrick Groot](https://github.com/pgroot91), @Piotr, @Mark_Gibson, and other active members who have provided a lot of valuable suggestions and bug reports. Please forgive us if your name is missing here.

* Plugin developers:

  * Jan Esser - [PHPUnit formatter for Katalon Recorder](https://bitbucket.org/inventis/phpunit-formatter-katalon-recorder) (currently working on Chrome)

  * Sam Kirkland - [Puppeteer exporter for Katalon Recorder](https://github.com/SamKirkland/Puppeteer-exporter-for-Katalon-Recorder).

## License

For details about licenses, refer to the following documents:

* [NOTICE](https://github.com/katalon-studio/katalon-recorder/blob/771c2e9620d59f75d97e78c5db9d25ce8a7543c1/APACHE%20LICENSE%202.0).
* [KATALON RECORDER CONTRIBUTION LICENSE AGREEMENT](https://github.com/katalon-studio/katalon-recorder/blob/771c2e9620d59f75d97e78c5db9d25ce8a7543c1/KATALON%20RECORDER%20CONTRIBUTION%20LICENSE%20AGREEMENT.md) for Katalon Recorder.
* [APACHE LICENSE 2.0](https://github.com/katalon-studio/katalon-recorder/blob/master/APACHE%20LICENSE%202.0) for SideeX.

Please inform us if you found any unlicensed part of the source code.

## Companion products

### Katalon TestOps

[Katalon TestOps](https://analytics.katalon.com) is a web-based application that provides dynamic perspectives and an insightful look at your automation testing data. You can leverage your automation testing data by transforming and visualizing your data; analyzing test results; seamlessly integrating with such tools as Katalon Studio and Jira; maximizing the testing capacity with remote execution.

### Katalon Studio
[Katalon Studio](https://www.katalon.com) is a free and complete automation testing solution for Web, Mobile, and API testing with modern methodologies (Data-Driven Testing, TDD/BDD, Page Object Model, etc.) as well as advanced integration (JIRA, qTest, Slack, CI, Katalon TestOps, etc.). Learn more about [Katalon Studio features](https://www.katalon.com/features/).
