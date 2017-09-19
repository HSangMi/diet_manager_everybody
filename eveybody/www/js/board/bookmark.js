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
                    userId: $loginId
                },
                dataType: "json",
                async: false
            }).done(function (result) {
                var source = $("#bookmark-template").html();
                var template = Handlebars.compile(source);

                var data = {bookmarkList: result.bookmarkList};
                for(var i = 0; i < result.fileList.length; i++) {
                    data.bookmarkList[i].path = result.fileList[i].path;
                    data.bookmarkList[i].sysName = result.fileList[i].sysName;
                    data.bookmarkList[i].oriName = result.fileList[i].oriName;
                }

                Handlebars.registerHelper("setImg", function(path, sysName, oriName) {
                    if(path === null) {
                        return oriName;
                    }
                    return file.preview(path, sysName);
                });
                Handlebars.registerHelper("setTitle", function(boardGenre, title) {
                    if(boardGenre === 2) {
                        return "[팁]" + title;
                    }
                    return "[영상]" + title;
                });
                Handlebars.registerHelper("moveTo", function(boardGenre) {
                    if(boardGenre === 2) {
                        return "tip";
                    }
                    return "work_out_detail";
                });

                var html = template(data);
                if(boardGenre === "tip") {
                    $("div#dietTips_bookmark").html(html);
                }
                else {
                    $("div#workout_bookmark").html(html);
                }
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