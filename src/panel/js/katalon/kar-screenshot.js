function clearScreenshotContainer() {
    $('#screenshotcontainer ul').empty();
}

function addToScreenshot(imgSrc, title) {
    if (!title) {
        title = new Date().toString();
    }
    var screenshotUl = $('#screenshotcontainer ul');
    var li = $('<li></li>');
    var a = $('<a></a>').attr('target', '_blank').attr('href', imgSrc).attr('title', title).attr('download', title).addClass('downloadable-screenshot');
    var img = $('<img>').attr('src', imgSrc).addClass('thumbnail');
    var screenshotTitle = $('<p></p>').text(title).hide();
    li.append(a.append(img)).append(screenshotTitle);
    screenshotUl.append(li);
    sideex_log.logScreenshot(imgSrc, title);
}

//for test
function addSampleDataToScreenshot() {
}

$(function() {

    $('#download-all').click(function() {
        $('.downloadable-screenshot').each(function() {
            this.click();
        });
    });
});