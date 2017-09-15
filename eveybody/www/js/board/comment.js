var comment = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/comment/",
        "list": "list.do",
        "childList": "child-list.do",
        "write": "write.do",
        "update": "update.do",
        "delete": "delete.do"
    };
    var commentModule = {
        bindEvent: function () {

        },
        /* 댓글 쓰기 폼 */
        commentWriteForm: function (userId) {
            var source = $("#comment-write-template").html();
            var template = Handlebars.compile(source);

            var data = {};
            data.userId = userId;

            var html = template(data);

            $("#commentWriteForm").html(html);
            commentModule.pageList(1);
        },
        /* 댓글 보기 */
        pageList: function (pageNo) {
            if (pageNo === undefined) {
                pageNo = 1;
            }
            $.ajax({
                url: urlList.contextPath + urlList.list,
                data: {
                    boardNo: urlProcess.urlParsing("boardNo"),
                    pageNo: pageNo
                },
                dataType: "json"
            }).done(commentModule.makePageList);
        },
        makePageList: function (result) {
            result.parent = 1;
            $("#commentListForm").html(commentModule.commentForm(result));

            // 대댓글 확인
            for(var i = 0; i < result.list.length; i++) {
                var commentNo = result.list[i].commentNo;
                $("#add-child-comment-" + commentNo).html("답글 달기");
                commentModule.childList(commentNo);
            }
        },
        commentForm: function (result) {
            var source = $("#comment-list-template").html();
            var template = Handlebars.compile(source);

            var cnoList = [];

            var data = result.list;

            Handlebars.registerHelper("setRegDate", function(regDate) {
                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

                var date = new Date(regDate);
                return  monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " "
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            });
            Handlebars.registerHelper("setUserImg", function(userId) {
                return profileImg.setUserImg(userId);
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
                html = "";
                /*
                // 첫 번째 페이지가 아니면 이전 페이지로 다시 호출해야 함...
                if(result.page.pageNo != 1) {
                    commentList(board.boardNo, result.page.pageNo - 1);
                    return ;
                }
                 */
            }
            return html;
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
        /* 대댓글 처리 */
        childList: function (commentNo) {
            $.ajax({
                url : urlList.contextPath + urlList.childList,
                data : {
                    commentNo : commentNo
                },
                dataType : "json",
                type : "post"
            }).done(function (result) {
                var data = result.list;
                if(data.length > 0) {
                    $("#row" + result.list[0].preCommentNo + " div.media-body").append(commentModule.commentForm(result));
                }
            });
        },
        /* 댓글 쓰기 */
        write: function () {
            var content = $("#commentWriteForm textarea[name='commentContent']");
            $.ajax({
                url : urlList.contextPath + urlList.write,
                data : {
                    boardNo : parseInt(urlProcess.urlParsing("boardNo")),
                    content : content.val(),
                    userId : getLoginId()
                },
                dataType : "json",
                type : "post"
            }).done(commentModule.pageList);
            content.val("");
        }
    };
    return {
        commentWriteForm: commentModule.commentWriteForm,
        write: commentModule.write,
        pageList: commentModule.pageList
    }
})();