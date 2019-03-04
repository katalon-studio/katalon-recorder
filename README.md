# Katalon Recorder

## How to add new formatter

`panel\index.html`:

```
<option value="new-formatter-sample">Sample for new formatters</option>
```

```
panel\js\katalon\newformatters\sample.js
```

## For Mozilla Reviewers

The file `atoms.js` was built from https://github.com/SeleniumHQ/selenium/tree/selenium-3.141.59.

Build steps:
```
./go build
./go //javascript/selenium-atoms
# output: build/javascript/selenium-atoms/selenium-atoms.js
```

The use of CSP and eval is necessary for a record & playback tool (including inject JavaScript PER user commands). There is no other way to do this so please don't disable our add on again.

## License

See NOTICE, LICENSE, and KATALON RECORDER OPEN-SOURCE LICENSE AGREEMENT.