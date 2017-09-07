var imageBoard = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/tip/",
        "list": "list.do",
        "write": "write.do",
        "detail": "detail.json",
        "setLike": "setLike.do",
        "like": "like.do",
        "update": "update.do",
        "delete": "delete.do"
    };
    var imageBoardModule = {
        bindEvent: function () {
            // 게시글 목록
            $(document.body).on("click", "#showWriteForm", function () {
                imageBoardModule.writeForm();
            });
            $(document.body).on("click", "#pagination li.disabled", function () {
                return false;
            });
            // 게시글 수정
            $(document.body).on("click", "#showUpdateForm", function () {
                imageBoardModule.updateForm(imageBoardModule.urlParsing("boardNo"));
            });
            $(document.body).on("click", "#updateBtn", function () {
                imageBoardModule.update(imageBoardModule.urlParsing("boardNo"));
            });
            // 게시글 삭제
            $(document.body).on("click", "#deleteBtn", function () {
                imageBoardModule.delete(imageBoardModule.urlParsing("boardNo"));
            });
            return imageBoardModule.urlParsing("boardNo");
        },
        urlParsing: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        /* url 변경 */
        modifyURL: function (param) {
            var renewURL = location.href;
            var paramInfo = param.split("=");

            if ((imageBoardModule.urlParsing(paramInfo[0])) === "") {
                renewURL = renewURL.substring(0, renewURL.indexOf("?"));
                renewURL += "?" + paramInfo[0] + "=" + paramInfo[1];
            }
            else {
                var regex = new RegExp('\\b' + paramInfo[0] + '\\b=([0-9]+)');
                renewURL = renewURL.replace(regex, paramInfo[0] + "=" + paramInfo[1]);
            }
            /*
            renewURL = renewURL.replace(/\?boardNo=([0-9]+)/gi, '');

            renewURL += '?boardNo=' + boardNo;
             */
            history.pushState(null, null, renewURL);
        },
        /* 게시글 목록 */
        pageList: function (pageNo) {
            $.ajax({
                url: urlList.contextPath + pageNo + "/" + urlList.list,
                dataType: "json"
            }).done(imageBoardModule.makePageList);
            imageBoardModule.modifyURL("pageNo=" + pageNo);
        },
        makePageList: function (result) {
            var data = result.list;
            if (data.length <= 0) {
                console.log("결과 없습니다");
                // 결과 없을 때 페이지 구성...
                return;
            }
            var source = $("#list-template").html();
            var template = Handlebars.compile(source);

            var html = template(data);
            $("#boardArea").append(html);
        },
        /* 무한 스크롤 */
        infiniteScroll: function () {
            var sh = $(window).scrollTop() + $(window).height();
            var dh = $(document).height();

            if (sh >= dh - 10) {
                imageBoardModule.pageList(2);
            }
        },
        /* 게시글 작성 */
        writeForm: function () {
            var source = $("#write-template").html();
            var template = Handlebars.compile(source);
            var html = template();

            $("div#boardArea").hide();
            $("div#buttonArea").html(html);
        },
        write: function () {
            var fileEle = $("input[name='attachFile']")[0];

            var fd = new FormData();
            fd.append("title", $("input#title").val());
            fd.append("content", $("textarea#content").val());
            for (var i = 0; i < fileEle.files.length; i++) {
                fd.append("attachFile" + i, fileEle.files[i]);
            }

            $.ajax({
                url: urlList.contextPath + urlList.write,
                data: fd,
                dataType: "json",
                type: "post",
                // 파일 업로드 처리 위한 옵션 추가
                processData: false,
                contentType: false
            }).done(imageBoardModule.detail);
        },
        /* 상세글 보기 */
        detail: function (boardNo) {
            imageBoardModule.modifyURL("boardNo=" + boardNo);
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.detail,
                data: {
                    boardNo: boardNo
                },
                dataType: "json"
            }).done(function (result) {
                var data = result.board;
                if (data === undefined) {
                    console.log("결과 없습니다");
                    $("#detail-form").html('<td style="text-align: center">등록된 게시물이 없습니다 ~ ^_^</td>');
                    return;
                }
                console.log("--------");
                console.dir(data);
                console.log("--------");

                var source = $("#detail-template").html();
                var template = Handlebars.compile(source);

                Handlebars.registerHelper("setRegDate", function (regDate) {
                    var date = new Date(regDate);
                    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                });
                Handlebars.registerHelper("setLike", function (boardNo) {
                    var likeCnt = 0;
                    var isLike = "<button type='button' id='likeBtn' onclick='board.doLike(" + boardNo + ");'>취소</button>";
                    $.ajax({
                        url: urlList.contextPath + boardNo + "/" + urlList.setLike,
                        dataType: "json",
                        async: false
                    }).done(function (result) {
                        likeCnt = "<span>" + result.likeCnt + "</span>";
                        if (result.isLike === 0) {
                            isLike = "<button type='button' id='likeBtn' onclick='board.doLike(" + boardNo + ");'>추천</button>";
                        }
                    });
                    return likeCnt + isLike;
                });
                var html = template(data);
                $("div#tipBoardForm").html(html);
                // 로그인 한 유저 이이디로 바꾸기.....
                // comment.commentWriteForm("user1");
            });
        },
        /* 추천 */
        doLike: function (boardNo) {
            console.log("doLike 호출");
            var isLike = $("#likeBtn").text();
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.like,
                dataType: "json",
                data: {
                    isLike: isLike
                },
                async: false
            }).done(function (result) {
                $("#likeCnt > span").text(result);
                if (isLike === "추천") {
                    $("#likeBtn").text("취소");
                }
                else {
                    $("#likeBtn").text("추천");
                }
            });
        },
        /* 수정 */
        updateForm: function (boardNo) {
            var data = {};
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.detail,
                dataType: "json"
            }).done(function (result) {
                data = result.board;
                var source = $("#update-template").html();
                var template = Handlebars.compile(source);

                var html = template(data);
                $("div#board-body").html(html);
            });
        },
        update: function (boardNo) {
            $.ajax({
                url: urlList.contextPath + urlList.update,
                dataType: "json",
                data: {
                    boardNo: boardNo,
                    title: $("#title").val(),
                    content: $("#content").val()
                },
                method: "post"
            }).done(imageBoardModule.detail);
        },
        /* 삭제 */
        delete: function (boardNo) {
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.delete,
                dataType: "json"
            }).done();
        }
    };
    
    imageBoardModule.pageList(1);
    imageBoardModule.bindEvent();
    
    return {
        infiniteScroll: imageBoardModule.infiniteScroll,
        write: imageBoardModule.write
    }
})();

$(window).scroll(imageBoard.infiniteScroll);