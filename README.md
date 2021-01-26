# Katalon Recorder
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-24-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://patrickgroot.com/"><img src="https://avatars.githubusercontent.com/u/6934501?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Patrick Groot</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=pgroot91" title="Code">💻</a> <a href="#question-pgroot91" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/devalex88"><img src="https://avatars.githubusercontent.com/u/36872529?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=devalex88" title="Code">💻</a> <a href="#maintenance-devalex88" title="Maintenance">🚧</a> <a href="#question-devalex88" title="Answering Questions">💬</a> <a href="https://github.com/katalon-studio/katalon-recorder/pulls?q=is%3Apr+reviewed-by%3Adevalex88" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/linhhuynhtruc"><img src="https://avatars.githubusercontent.com/u/44353766?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Linh Huynh</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=linhhuynhtruc" title="Code">💻</a> <a href="#maintenance-linhhuynhtruc" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://dafuqisthatblog.wordpress.com/"><img src="https://avatars.githubusercontent.com/u/16775806?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tô Minh Thành</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=minhthanh3145" title="Code">💻</a> <a href="#maintenance-minhthanh3145" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/anthonybriand"><img src="https://avatars.githubusercontent.com/u/1897855?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anthony BRIAND</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=anthonybriand" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sonpham96"><img src="https://avatars.githubusercontent.com/u/18463816?v=4?s=100" width="100px;" alt=""/><br /><sub><b>sonpham96</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=sonpham96" title="Code">💻</a> <a href="#maintenance-sonpham96" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/UpUpDwnDwnLftRt"><img src="https://avatars.githubusercontent.com/u/20846401?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mark</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=UpUpDwnDwnLftRt" title="Code">💻</a> <a href="#question-UpUpDwnDwnLftRt" title="Answering Questions">💬</a> <a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3AUpUpDwnDwnLftRt" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/huynguyen2908"><img src="https://avatars.githubusercontent.com/u/25784067?v=4?s=100" width="100px;" alt=""/><br /><sub><b>huynguyen2908</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=huynguyen2908" title="Code">💻</a> <a href="#maintenance-huynguyen2908" title="Maintenance">🚧</a> <a href="https://github.com/katalon-studio/katalon-recorder/pulls?q=is%3Apr+reviewed-by%3Ahuynguyen2908" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/zoldike-gh"><img src="https://avatars.githubusercontent.com/u/55282625?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Zoldike</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=zoldike-gh" title="Code">💻</a> <a href="#question-zoldike-gh" title="Answering Questions">💬</a></td>
    <td align="center"><a href="http://www.svrnm.de/"><img src="https://avatars.githubusercontent.com/u/1519757?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Severin Neumann</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=svrnm" title="Code">💻</a></td>
    <td align="center"><a href="https://www.olenitsj.com/"><img src="https://avatars.githubusercontent.com/u/31991339?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Igor Olenitsj</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=olenitsj" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/reyelts"><img src="https://avatars.githubusercontent.com/u/34944431?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tony Reyelts</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=reyelts" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dt-mafe"><img src="https://avatars.githubusercontent.com/u/23524331?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Manuel Feichter</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=dt-mafe" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tanben"><img src="https://avatars.githubusercontent.com/u/3752614?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ben Tan</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=tanben" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://mileslin.github.io/"><img src="https://avatars.githubusercontent.com/u/6435369?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Miles</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=MilesLin" title="Code">💻</a></td>
    <td align="center"><a href="http://www.aalasolutions.com/"><img src="https://avatars.githubusercontent.com/u/1493178?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aamir Mahmood</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/commits?author=aalasolutions" title="Code">💻</a></td>
    <td align="center"><a href="https://programmedbycoincidence.blogspot.com/"><img src="https://avatars.githubusercontent.com/u/12137106?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Petr Bodnar</b></sub></a><br /><a href="#question-pbodnar" title="Answering Questions">💬</a> <a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3Apbodnar" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/adam-lane-columbus-ohio/"><img src="https://avatars.githubusercontent.com/u/10150394?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Lane</b></sub></a><br /><a href="#question-alane019" title="Answering Questions">💬</a></td>
    <td align="center"><a href="http://blog.miniasp.com/"><img src="https://avatars.githubusercontent.com/u/88981?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Will 保哥</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/pulls?q=is%3Apr+reviewed-by%3Adoggy8088" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/AycaGozel"><img src="https://avatars.githubusercontent.com/u/53177426?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AycaGozel</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3AAycaGozel" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://liyinchigithub.github.io/archives/"><img src="https://avatars.githubusercontent.com/u/19643260?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jack LI</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3Aliyinchigithub" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.boris.ca/"><img src="https://avatars.githubusercontent.com/u/7527307?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Boris Reisig</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3Abreisig" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://leandrocadetedasilva.blogspot.com/"><img src="https://avatars.githubusercontent.com/u/6534768?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Leandro Cadete da Silva</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3Aleandrocadete" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/alexandremsouza1"><img src="https://avatars.githubusercontent.com/u/38253342?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alexandre Magno</b></sub></a><br /><a href="https://github.com/katalon-studio/katalon-recorder/issues?q=author%3Aalexandremsouza1" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!