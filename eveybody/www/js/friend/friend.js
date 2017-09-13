var friend = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/friend/",
        "autocomplete": "autocomplete.do",
        "list": "list.do",
        "request": "request.do",
        "confirm": "confirm.do",
        "delete": "delete.do"
    };
    var friendModule = {
        init: function () {
            var source = $("#friend-add-template").html();
            var template = Handlebars.compile(source);

            var html = template();
            $("div#addFriend").html(html);

            friendModule.bindEvent();
            friendModule.autoComplete();
            friendModule.list();
        },
        bindEvent: function () {
            $(document.body).on("click", "#addFriendBtn", function () {
                $("#addFriend").modal();
            });
            $(document.body).on("click", "#searchDiv > div.input-group-btn", function () {
                friendModule.request();
            });
        },
        /* 자동 완성 */
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
        /* 친구 요청 */
        request: function () {
            var friendId = $("#searchIdTxt").val();

            if(friendId === $loginId) {
                console.log("내가 나랑 친구한다고?..");
                /* 처리 해줄 것.. */
                return ;
            }

            $.ajax({
                url: urlList.contextPath + urlList.request,
                data: {
                    userId: $loginId,
                    friendId: friendId
                },
                type: "post"
            }).done(function (result) {
                if(result === "존재하지 않는 아이디 입니다") {
                    console.log("잘못된 아이디");
                    return ;
                }
                $("#modalCloseBtn").click();
                $("#searchIdTxt").val("");
            });
        },
        /* 친구 목록 */
        list: function () {
            $.ajax({
                url: urlList.contextPath + urlList.list,
                data: {
                    userId: $loginId
                },
                type: "post"
            }).done(function (result) {
                var source = $("#friend-list-template").html();
                var template = Handlebars.compile(source);

                var data = result;

                Handlebars.registerHelper("setProfileImg", function (friendId) {
                    return notification.setFriendPhoto(friendId);
                });

                Handlebars.registerHelper("setProfileInfo", function (friendId) {
                    return notification.setFriendInfo(friendId);
                });

                var html = template(data);
                $("#friendListUl").html(html);

                profile.showProfile();
            });
        },
        /* 친구 삭제 */
        delete: function (friendId) {
            $.ajax({
                url: urlList.contextPath + urlList.delete,
                data: {
                    userId: $loginId,
                    friendId: friendId
                },
                type: "post"
            }).done(friendModule.list);
        }

    };

    friendModule.init();

    return {
        list: friendModule.list,
        delete: friendModule.delete
    }
})();