class Log {

  constructor(container) {
    this.container = container;
  }

  log(str) {
    this._write(str, "log-info");
  }

  info(str) {
    this._write("[info] " + str, "log-info");
  }

  error(str) {
    this._write("[error] " + str, "log-error");
  };

  appendA(str, id) {
    let a = document.createElement('a');
    a.setAttribute("href", "#");
    a.setAttribute("id", id);
    a.setAttribute("class", "katalon-link");
    a.textContent = str;
    this.container.appendChild(a);
    this.container.scrollIntoView(false);
  }

  _write(str, className) {
    let textElement = document.createElement('h4');
    textElement.setAttribute("class", className);
    textElement.textContent = str;
    this.container.appendChild(textElement);
    this.container.scrollIntoView(false);
  }

  //KAT-BEGIN log HTML
  logHTML(str) {
    this.container.innerHTML = str;
    this.container.scrollIntoView(false);
  }

  logScreenshot(imgSrc, title) {
    let className = "log-info";
    let textElement = document.createElement('h4');
    textElement.setAttribute("class", className);

    var a = $('<a></a>').attr('target', '_blank').attr('href', imgSrc).attr('title', title).attr('download', title);
    var img = $('<img>').attr('src', imgSrc).addClass('thumbnail');

    $(textElement).append(a.append(img));
    this.container.appendChild(textElement);
    this.container.scrollIntoView(false);
  }

  //KAT-END
}

export { Log }