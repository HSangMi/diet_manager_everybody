var friend = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/friend/",
        "autocomplete": "autocomplete.do",
        "list": "list.do",
        "request": "request.do",
        "confirm": "confirm.do"
    };
    var friendModule = {
        init: function () {
            var source = $("#friend-add-template").html();
            var template = Handlebars.compile(source);

            var html = template();
            $("div#addFriend").html(html);

            friendModule.bindEvent();
            friendModule.autoComplete();
        },
        bindEvent: function () {
            $(document.body).on("click", "#addFriendBtn", function () {
                $("#addFriend").modal();
            });
            $(document.body).on("click", "#searchDiv > div.input-group-btn", function () {
                friendModule.request();
            });
        },
        autoComplete: function () {
            $("#searchIdTxt").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        type: "post",
                        url: urlList.contextPath + urlList.autocomplete,
                        dataType: "json",
                        data: {
                            value: request.term
                        }
                    }).done(function (result) {
                        response(
                            $.map(result, function (item) {
                                return {
                                    label: item,
                                    value: item
                                }
                            })
                        );
                    });
                },
                minLength: 1,
                select: function (event, ui) {
                    // 만약 검색 리스트에서 선택하였을 때 선택한 데이터에 의한 이벤트발생
                }
            });
        },
        request: function () {
            $.ajax({
                url: urlList.contextPath + urlList.request,
                data: {
                    userId: /* 로그인 한 아이디로 변경 */"admin",
                    friendId: $("#searchIdTxt").val()
                },
                type: "post"
            }).done(function (result) {
                if(result === "존재하지 않는 아이디 입니다") {
                    console.log("잘못된 아이디");
                    return ;
                }
                $("#modalCloseBtn").click();
            });
        }

    };

    friendModule.init();

})();