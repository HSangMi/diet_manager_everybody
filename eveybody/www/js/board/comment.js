var comment = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/comment/",
        "list": "list.do",
        "childList": "child-list.do",
        "select": "selectComment.do",
        "write": "write.do",
        "update": "update.do",
        "delete": "delete.do"
    };
    var commentModule = {
        bindEvent: function () {
            $(document.body).on("click", ".media-body div a[id^='edit']", function () {
                commentModule.commentUpdateForm(this.id.substring(4));
            });
            $(document.body).on("click", ".media-body div a[id^='del']", function () {
                commentModule.commentDelete(this.id.substring(3));
            });
            $(document.body).on("click", ".add-child-comment > a:nth-child(1)", function () {
                commentModule.childWriteForm(this.id);
            });
            $(document.body).on("click", ".add-child-comment > a:nth-child(2)", function () {
                commentModule.childClose(this.id);
            });
            $(document.body).on("click", ".media-body div a[id^='update']", function () {
                commentModule.commentUpdate(this.id.substring(6));
            });
            $(document.body).on("click", ".media-body div a[id^='cancel']", function () {
                commentModule.commentCancel(this.id.substring(6));
            });
        },
        /* 댓글 쓰기 폼 */
        commentWriteForm: function (userId) {
            if(userId !== null){
                var source = $("#comment-write-template").html();
                var template = Handlebars.compile(source);

                var data = {};
                data.userId = userId;

                Handlebars.registerHelper("setUserImg", function(userId) {
                    return profileImg.setUserImg(userId);
                });
                var html = template(data);

                $("#commentWriteForm").html(html);
                commentModule.pageList(1);
            }else{
                $("#commentWriteForm").html("<p>로그인 후 사용가능합니다</p>");
            }

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
                var html = " <a id='"+commentNo+"'>답글 달기</a>";
                html += "<a  id='"+commentNo+"' style='display:none;'>닫기</a>";
                $("#add-child-comment-" + commentNo).html(html);
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
            Handlebars.registerHelper("setEditDelBtn", function(userId, commentNo) {
                var resultTag = "";
                if(userId === getLoginId()){
                    resultTag += "<a class='link' id='edit"+commentNo+"' >수정</a> &nbsp; &nbsp; &nbsp;";
                    resultTag += "<a class='link' id='del"+commentNo+"' >삭제</a>";
                }
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
        },
        commentUpdateForm : function(commentNo){
            $("div[id^='con'] textarea").remove();
            $("div[id^='con'] p").show();

            $("div[id^='btns'] div:nth-child(2)").remove();
            $("div[id^='btns'] div:nth-child(1)").show();


            var pTag = $("div#con"+commentNo);
            var content = pTag.children("p").html();
            var html = "<input class='form-control' id='editContent' value='"+content+"' required/>";
            pTag.children("p").hide();
            pTag.append(html);

            html = "<div><a class='link' id='update"+commentNo+"' >저장</a> &nbsp; &nbsp; &nbsp;";
            html += "<a class='link' id='cancel"+commentNo+"'>취소</a></div>";
            $("div#btns"+commentNo+" div:nth-child(1)").hide();
            $("div#btns"+commentNo).append(html);

        },
        commentUpdate : function(commentNo){
            var answer = confirm("댓글을 수정하시겠습니까?");
            if(answer){
                $.ajax({
                    url: urlList.contextPath + urlList.update,
                    data: {
                        commentNo : commentNo,
                        content: $("input#editContent").val()
                    },
                    dataType: "json",
                    async:false,
                    type: "post"
                }).done(function(result){
                    console.log(result);
                    if(result === 0) {
                        console.log("부모댓글이 없음");
                        commentModule.resetComment(commentNo);
                    }else {
                        console.log("부모댓글이 있음");
                        commentModule.resetComment(result);
                    }
                });
            }
        },
        commentCancel : function(commentNo){
            $("div#con"+commentNo+" input").remove();
            $("div#con"+commentNo+" p").show();

            $("div#btns"+commentNo+" div:nth-child(1)").show();
            $("div#btns"+commentNo+" div:nth-child(2)").remove();
        },
        commentDelete : function(commentNo){
            console.log("댓글 삭제");
            console.log(commentNo);

            var answer = confirm("댓글을 삭제하시겠습니까?");
            if(answer){
                $.ajax({
                    url: urlList.contextPath + urlList.delete,
                    data: {
                        commentNo : commentNo
                    },
                    dataType: "json",
                    async:false,
                    type: "post"
                }).done(function(result){
                    if(result === 0) {
                        $("div#row"+commentNo).remove();
                    }else {
                        commentModule.resetComment(result);
                    }
                });
            }
        },
        /* 대댓글 폼 */
        childWriteForm : function(commentNo) {
            console.log("대댓글폼");
            $("div[id^='child']").remove();
            $("p[id^='add-child-comment-'] > a:nth-child(1)").show();
            $("p[id^='add-child-comment-'] > a:nth-child(2)").hide();
            $("#add-child-comment-" + commentNo + " > a:nth-child(1)").hide();
            $("#add-child-comment-" + commentNo + " > a:nth-child(2)").show();

            var source = $("#child-write-template").html();
            var template = Handlebars.compile(source);

            var data = {};
            data.userId = getLoginId();
            data.commentNo = commentNo;

            Handlebars.registerHelper("setUserImg", function(userId) {
                return profileImg.setUserImg(userId);
            });

            var html = template(data);

            $("#add-child-comment-" + commentNo).append(html);

        },
        childClose : function(commentNo){
            $("div#child"+commentNo).remove();
            $("#add-child-comment-" + commentNo + " > a:nth-child(1)").show();
            $("#add-child-comment-" + commentNo + " > a:nth-child(2)").hide();
        },
        childWrite : function(preCommentNo) {
            console.log("대댓글 작성 : ", preCommentNo);
            $.ajax({
                url: urlList.contextPath + urlList.write,
                data: {
                    boardNo: parseInt(urlProcess.urlParsing("boardNo")),
                    content: $("input#childContent").val(),
                    userId: getLoginId(),
                    preCommentNo: preCommentNo
                },
                dataType: "json",
                type: "post"
            }).done(commentModule.resetComment(preCommentNo));

            $("input#childContent").val("");
        },
        resetComment : function(commentNo){
            $.ajax({
                url: urlList.contextPath + urlList.select,
                data: {
                    commentNo : commentNo
                },
                dataType: "json"
            }).done(function(result){
                var source = $("#comment-reset-template").html();
                var template = Handlebars.compile(source);

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
                Handlebars.registerHelper("setEditDelBtn", function(userId, commentNo) {
                    var resultTag = "";
                    if(userId === getLoginId()){
                        resultTag += "<a class='link' id='edit"+commentNo+"' >수정</a> &nbsp; &nbsp; &nbsp;";
                        resultTag += "<a class='link' id='del"+commentNo+"' >삭제</a>";
                    }
                    return resultTag;
                });
                var html = template(result);
                $("div#row"+commentNo).html(html);

                html = " <a id='"+commentNo+"'>답글 달기</a>";
                html += "<a  id='"+commentNo+"' style='display:none;'>닫기</a>";
                $("#add-child-comment-" + commentNo).html(html);
                commentModule.childList(commentNo);

                // $("#add-child-comment-"+commentNo+" a:nth-child(1)").trigger("click");
            });
        }

    };

    commentModule.bindEvent();

    return {
        commentWriteForm: commentModule.commentWriteForm,
        write: commentModule.write,
        pageList: commentModule.pageList,
        childWrite: commentModule.childWrite
    }
})();