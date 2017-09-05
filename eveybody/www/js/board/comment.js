var comment = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/comment/",
        "list": "list.do",
        "write": "write.do",
        "update": "update.do",
        "delete": "delete.do",
        "setLike": "setLike.do",
        "like": "like.do"
    };
    var commentModule = {
        bindEvent: function () {

        },
        /* 댓글 보기 */
        pageList: function (boardNo, pageNo) {
            if (pageNo === undefined) {
                pageNo = 1;
            }
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + pageNo + "/" + urlList.list,
                dataType: "json"
            }).done(listModule.makePageList);
        },
        makePageList: function () {
            var source = $("#comment-list-template").html();
            var template = Handlebars.compile(source);

            var cnoList = [];

            var data = {};
            data = result.commentList;

            Handlebars.registerHelper("regDate", function(regDate) {
                var date = new Date(regDate);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            });

            Handlebars.registerHelper("updateAndDelete", function(cno, content, userId) {
                var resultTag = "";
                cnoList.push(cno);
                $.when($connectUserId).done(function (result1) {
                    if (result1.userId == userId) {
                        resultTag = "<a href='javascript:commentUpdateForm(" + cno + ", \"" + content + "\", \"" + userId + "\");'>update</a>"
                                  + "<a href='javascript:commentDelete(" + cno + ");'>delete</a>";
                    }
                });
                return resultTag;
            });

            var html = template(data);
            if (!data.length) {
                html += "<tr><td colspan='4'>아직 등록된 댓글이 없어요</td></tr>";

                // 첫 번째 페이지가 아니면 이전 페이지로 다시 호출해야 함...
                if(result.pageResult.pageNo != 1) {
                    commentList($("#detailForm tr:eq(1) > td:eq(0)").html(), result.pageResult.pageNo - 1);
                    return ;
                }
            }

            $("#commentListForm").html(html);
            makeRecomment(cnoList);

            makeCommentPageLink(result.pageResult, $("#detailForm tr:eq(1) > td:eq(0)").html());
        },
        makePageNav: function () {

        }
    };
})();
