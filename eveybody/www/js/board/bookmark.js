var bookmark = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/bookmark/",
        "get": "get.do",
        "set": "set.do",
        "add": "add.do"
    };
    var bookmarkModule = {
        bindEvent: function () {
            // 북마크
            $(document.body).on("click", "a.bookmark-button", function() {
                if(getLoginId()!==null){
                    $(this).toggleClass('added');
                }
            });
        },
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
                if(result !== 0) {
                    $(document).ready(function () {
                        $("a.bookmark-button").addClass('added');
                    });
                }
            });
        },
        add: function (boardNo) {
            if(getLoginId()!==null){
            var isBookmark = 0;
            if($("a.bookmark-button.added")[0]) {
                isBookmark = 1;
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
            }else {
                alert("로그인 후 사용가능합니다.");
            }
        }
    };
    bookmarkModule.bindEvent();
    return {
        getBookmark: bookmarkModule.getBookmark,
        setBookmark: bookmarkModule.setBookmark,
        add: bookmarkModule.add
    }
})();