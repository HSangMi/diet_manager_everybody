var comment = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/comment/",
        "list": "list.do",
        "write": "write.do",
        "update": "update.do",
        "delete": "delete.do"
    };
    var commentModule = {
        bindEvent: function () {

        },
        urlParsing: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        /* 댓글 쓰기 폼 */
        commentWriteForm: function (userId) {
            var source = $("#comment-write-template").html();
            var template = Handlebars.compile(source);

            var data = {};
            data.boardNo = commentModule.urlParsing("boardNo");
            data.userId = userId;

            var html = template(data);

            $("#commentWriteForm").html(html);
            commentModule.pageList(data.boardNo, 1);
        },
        /* 댓글 보기 */
        pageList: function (boardNo, pageNo) {
            if (pageNo === undefined) {
                pageNo = 1;
            }
            $.ajax({
                url: urlList.contextPath + urlList.list,
                data: {
                    boardNo: boardNo,
                    pageNo: pageNo
                },
                dataType: "json"
            }).done(commentModule.makePageList);
        },
        makePageList: function (result) {
            var source = $("#comment-list-template").html();
            var template = Handlebars.compile(source);

            var cnoList = [];

            var data = {};
            data = result.list;

            Handlebars.registerHelper("regDate", function(regDate) {
                var date = new Date(regDate);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            });
            Handlebars.registerHelper("updateAndDelete", function(commentNo, content, userId) {
                var resultTag = "";
                /*
                cnoList.push(cno);
                $.when($connectUserId).done(function (result1) {
                    if (result1.userId == userId) {
                        resultTag = "<a href='javascript:commentUpdateForm(" + cno + ", \"" + content + "\", \"" + userId + "\");'>update</a>"
                                  + "<a href='javascript:commentDelete(" + cno + ");'>delete</a>";
                    }
                });
                 */
                return resultTag;
            });
            var html = template(data);
            if (!data.length) {
                html = "<tr><td colspan='4'>아직 등록된 댓글이 없어요</td></tr>";

                /*
                // 첫 번째 페이지가 아니면 이전 페이지로 다시 호출해야 함...
                if(result.page.pageNo != 1) {
                    commentList(board.boardNo, result.page.pageNo - 1);
                    return ;
                }
                 */
            }

            $("#commentListForm").html(html);
            // makeRecomment(cnoList);

            // makeCommentPageLink(result.pageResult, board.boardNo);
        },
        makePageNav: function (page) {
            var html = "";
            if (page.count !== 0) {
                var clz = "";
                if (page.prev === false) {
                    clz = "disabled";
                }
                html += '<li class="' + clz + '">';

                var fn = "";
                if (page.prev === true) {
                    fn = urlList.contextPath + (page.beginPage - 1) + "/" + urlList.list;
                }
                html += '<a href="' + fn + '" class="prev"><i class="fa fa-chevron-left"></i></a>';

                for (var i = page.beginPage; i <= page.endPage; i++) {
                    if (i === page.pageNo) {
                        html += '<li class="active"><a href="#1">' + i + '</a></li>';
                    } else {
                        html += '' + urlList.contextPath + i + "<li><a href=" / ">" + urlList.list + '' + i + '</a></li>';
                    }
                }

                clz = "";
                if (page.next === false) {
                    clz = "disabled";
                }
                html += '<li class="' + clz + '">';

                fn = "";
                if (page.next === true) {
                    fn = urlList.contextPath + (page.endPage + 1) + "/" + urlList.list;
                }
                html += '<a href="' + fn + '" class="next"><i class="fa fa-chevron-right"></i></a>';

                $("#pagination").html(html);
            }
        },
        /* 댓글 쓰기 */
        write: function (boardNo) {
            var content = $("table#commentWriteForm textarea[name='commentContent']");
            $.ajax({
                url : urlList.contextPath + urlList.write,
                data : {
                    boardNo : parseInt(boardNo),
                    content : content.val()
                },
                dataType : "json",
                type : "post"
            }).done(commentModule.makePageList);
            content.val("");
        }
    };
    return {
        commentWriteForm: commentModule.commentWriteForm,
        write: commentModule.write
    }
})();
