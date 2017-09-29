var friend = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/friend/",
        "contextProfilePath": "http://192.168.0.16:8000/user/setting/",
        "profile": "profile.do",
        "autocomplete": "autocomplete.do",
        "list": "list.do",
        "request": "request.do",
        "confirm": "confirm.do",
        "delete": "delete.do",
        "friendCheck": "friend-check.do",
        "sendMsg": "send-msg.do",
        "readMsg": "read-msg.do"
    };
    var friendModule = {
        init: function () {
            var source = $("#friend-add-template").html();
            var template = Handlebars.compile(source);

            var html = template();
            $("div#profileRow").after(html);

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
        request: function (friendId) {
            if(!friendId) {
                friendId = $("#searchIdTxt").val();
            }

            if(friendId === $loginId) {
                console.log("혹시.. 왕따?...");
                /* 
                    자신에게 친구 요청하는 경우
                    처리 해줄 것.. 
                 */
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
                    return profileImg.setUserImg(friendId);
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
        },
        /* 친구 정보 보기 */
        detail: function (friendId) {
            $.ajax({
                url: urlList.contextProfilePath + urlList.profile,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId : friendId
                }
            }).done(function (result) {
                var source = $("#friend-detail-template").html();
                var template = Handlebars.compile(source);

                var data = result.userInfo;
                data.friendCnt = result.friendCnt;

                Handlebars.registerHelper("setProfileImg", function (userId) {
                    return notification.setFriendPhoto(userId);
                });

                Handlebars.registerHelper("setAddBtn", function (userId) {
                    if(friendModule.friendCheck(userId) === 1) {
                        return "그룹초대";
                    }
                    /* 이미 친구일 경우 처리 */
                    return "친구추가";
                });

                var html = template(data);
                $("#profileRow").after(html);

                friendModule.friendCheck(friendId);
                $("#friendInfo").modal();
            });
        },
        /* 친구 여부 */
        friendCheck: function (friendId) {
            var returnVal = 1;
            $.ajax({
                url: urlList.contextPath + urlList.friendCheck,
                data: {
                    userId: $loginId,
                    friendId: friendId
                },
                type: "post",
                async: false
            }).done(function (result) {
                if(result === "친구 아님") {
                    returnVal = 0;
                }
            });
            return returnVal;
        },
        /* 쪽지 modal 띄우기 */
        sendMsgForm: function (friendId) {
            $("#friendProfileClose").click();
            var data = {};
            data.friendId = friendId;

            var source = $("#send-msg-template").html();
            var template = Handlebars.compile(source);

            var html = template(data);
            $("#profileRow").after(html);

            $("#sendMsg").modal();
        },
        /* 메세지 보내기 */
        sendMsg: function (friendId) {
            $.ajax({
                url: urlList.contextPath + urlList.sendMsg,
                data: {
                    userId: $loginId,
                    friendId: friendId,
                    content: $("#sendMsgTxt").val()
                },
                type: "post"
            }).done(function () {
                console.log("insert 완료");
                notification.message();
            });
        },
        /* 메세지 읽기 */
        readMsg: function (msgNo) {
            $.ajax({
                url: urlList.contextPath + urlList.readMsg,
                data: {
                    msgNo: msgNo
                },
                type: "post"
            }).done(function () {
                console.log("update 완료");
                notification.message();
            });
        }
    };

    friendModule.init();

    return {
        list: friendModule.list,
        delete: friendModule.delete,
        detail: friendModule.detail,
        request: friendModule.request,
        sendMsgForm: friendModule.sendMsgForm,
        sendMsg: friendModule.sendMsg,
        readMsg: friendModule.readMsg
    }
})();