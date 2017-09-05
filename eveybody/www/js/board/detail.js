(function () {
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
    var detailModule = {
        bindEvent: function () {
            var boardNo = detailModule.urlParsing("boardNo");
            $(document.body).on("click", "#pagination li.disabled", function () {
                return false;
            });
            $(document.body).on("click", "#likeBtn", function () {
                detailModule.doLike(boardNo);
            });
            $(document.body).on("click", "#showUpdateForm", function () {
                detailModule.updateForm(boardNo);
            });
            $(document.body).on("click", "#updateBtn", function () {
                detailModule.update(boardNo);
            });
            $(document.body).on("click", "#deleteBtn", function () {
                detailModule.delete(boardNo);
            });
        },
        urlParsing: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        /* 게시글 목록 */
        /*
        pageList: function (pageNo) {
            $.ajax({
                url: urlList.contextPath + pageNo + "/" + urlList.list,
                dataType: "json"
            }).done(detailModule.makePageList);
        },
        makePageList: function (result) {
            var data = result.list;
            if (data.length <= 0) {
                console.log("결과 없습니다");
                return;
            }
            var source = $("#list-template").html();
            var template = Handlebars.compile(source);

            Handlebars.registerHelper("setRegDate", function (regDate) {
                var date = new Date(regDate);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            });
            var html = template(data);
            $("table > tbody").html(html);
            detailModule.makePageNav(result.page);
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
         */
        /* 게시글 작성 */
        writeForm: function () {
            var source = $("#write-template").html();
            var template = Handlebars.compile(source);

            var html = template();
            $("div#board-body").html(html);
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
            }).done(function (result) {
                // createAlert('', '게시글 등록', '게시글이 등록 되었습니다!', 'success', true, true, 'pageMessages', "/myBoard/board/" + result + "/detail.do");
            });
        },
        /* 상세글 보기 */
        detail: function (boardNo) {
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
                    return;
                }
                var source = $("#detail-template").html();
                var template = Handlebars.compile(source);

                Handlebars.registerHelper("setRegDate", function (regDate) {
                    var date = new Date(regDate);
                    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                });
                Handlebars.registerHelper("setLike", function (boardNo) {
                    var likeCnt = 0;
                    var isLike = "<button type='button' id='likeBtn'>취소</button>";
                    $.ajax({
                        url: urlList.contextPath + boardNo + "/" + urlList.setLike,
                        dataType: "json",
                        async: false
                    }).done(function (result) {
                        likeCnt = "<span>" + result.likeCnt + "</span>";
                        if (result.isLike === 0) {
                            isLike = "<button type='button' id='likeBtn'>추천</button>";
                        }
                        ;
                    });
                    return likeCnt + isLike;
                });
                var html = template(data);
                $("div.tbl-content > table > tbody").html(html);
            });
        },
        /* 추천 */
        doLike: function (boardNo) {
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
                if(isLike === "추천") {
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
            }).done(detailModule.detail);
        },
        /* 삭제 */
        delete: function (boardNo) {
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.delete,
                dataType: "json"
            }).done();
        }
    };
    detailModule.bindEvent();
    // detailModule.pageList($("#pagination li a.active").text());
    detailModule.detail(detailModule.urlParsing("boardNo"));
})();