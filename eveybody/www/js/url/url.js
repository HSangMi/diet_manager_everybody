var urlProcess = (function () {
    var urlModule = {
        modifyURL: function (pageUrl, layer) {
            var renewURL = location.href;
            renewURL = renewURL.substring(0, renewURL.lastIndexOf("/") + 1);
            renewURL += pageUrl;

            history.pushState({prePage: $("div#" + layer).html(), sideMenu: $("aside.main-sidebar").html(), divName: layer}, null, renewURL);
        }
    };
    return {
        modifyURL: urlModule.modifyURL
    }
})();

$(window).on('popstate', function(event) {
    var data = event.originalEvent.state;
    $("div.pagelayer").hide();
    $("aside.main-sidebar").html(data.sideMenu);
    $("div#" + data.divName).html(data.prePage).show();
});