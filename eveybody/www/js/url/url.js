var urlProcess = (function () {
    var urlModule = {
        modifyURL: function () {
            var renewURL = location.href;

            var temp = "";
            console.log( renewURL.lastIndexOf(renewURL, "/") );
            temp = temp.substring(0, renewURL.lastIndexOf(renewURL, "/"));

            history.pushState({prePage: $("div#myBodyArea").html()}, null, renewURL);
        }
    };
})();