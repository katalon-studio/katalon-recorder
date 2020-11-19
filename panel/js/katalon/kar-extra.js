var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-183240578-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).on('click', 'button,a,select,input,i', function() {
    var element = $(this);
    var id = element.attr('id');
    if (!id) {
        var parent = element.closest("[id]");
        if (parent) {
            id = parent.attr('id');
            if (!id) {
                id = element.text();
            }
        }
    }
    var value;
    if (element.is('select')) {
        value = element.val();
    } else {
        value = 'clicked';
    }
    _gaq.push(['_trackEvent', id, value]);
});