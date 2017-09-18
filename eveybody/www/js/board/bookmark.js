var bookmark = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/bookmark/",
        "get": "get.do",
        "set": "set.do",
        "add": "add.do"
    };
    var bookmarkModule = {
        /* 북마크 */
        getBookmark: function (boardGenre) {
            $.ajax({
                url: urlList.contextPath + boardGenre + "/" + urlList.get,
                data: {
                    userId: getLoginId()
                },
                dataType: "json",
                async: false
            }).done(function (result) {
                if(result === 0) {
                    $("i.fa.fa-star")
                        .removeClass("fa-star")
                        .addClass("fa-star-o");
                }
                var source = $("#bookmark-tip-template").html();
                var template = Handlebars.compile(source);

                var html = template(data);
                $("div#dietTips_bookmark").append(html);
            });
        },
        setBookmark: function (boardNo) {
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.set,
                data: {
                    userId: getLoginId()
                },
                dataType: "json",
                async: false
            }).done(function (result) {
                if(result === 0) {
                    $("i.fa.fa-star")
                        .removeClass("fa-star")
                        .addClass("fa-star-o");
                }
            });
        },
        add: function (boardNo) {
            var isBookmark = 0;
            if($("a.bookmark")[0]) {
                if($("a.bookmark > i.fa-star")[0]) {
                    $("i.fa.fa-star")
                        .removeClass("fa-star")
                        .addClass("fa-star-o");
                    isBookmark = 1;
                }
                else {
                    $("i.fa.fa-star-o")
                        .removeClass("fa-star-o")
                        .addClass("fa-star");
                }
            }
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.add,
                dataType: "json",
                data: {
                    isBookmark: isBookmark,
                    userId: getLoginId()
                },
                async: false
            });
        }
    };
    return {
        getBookmark: bookmarkModule.getBookmark,
        setBookmark: bookmarkModule.setBookmark,
        add: bookmarkModule.add
    }
})();