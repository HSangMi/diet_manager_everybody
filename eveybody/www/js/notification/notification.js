var notification = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/friend/",
        "contextProfilePath": "http://192.168.0.16:8000/user/setting/",
        "profile": "profile.do",
        "notification": "notification.do",
        "requestTime": "request-time.do",
        "confirm": "confirm.do",
        "showMsg": "show-msg.do"
    };
    /* 알림 체크 */
    var notificationModule = {
        init: function () {
            notificationModule.notification();
            notificationModule.message();
        },
        notification: function () {
            $.ajax({
                type: "post",
                url: urlList.contextPath + urlList.notification,
                dataType: "json",
                data: {
                    userId: $loginId
                }
            }).done(function (result) {
                var source = $("#friend-request-template").html();
                var template = Handlebars.compile(source);

                var data = result;

                Handlebars.registerHelper("setRequestCnt", function (requestCnt) {
                    if(requestCnt !== 0) {
                        return "<span class=\"label label-success\">" + requestCnt + "</span>";
                    }
                });

                Handlebars.registerHelper("setProfileImg", function (friendId) {
                    return profileImg.setUserImg(friendId);
                });
                Handlebars.registerHelper("setProfileInfo", function (friendId) {
                    return notificationModule.setFriendInfo(friendId);
                });
                Handlebars.registerHelper("setTime", function (friendId) {
                    return notificationModule.setRequestTime(friendId);
                });

                var html = template(data);
                $("#friendRequest").html(html);
            });
        },
        message: function () {
            $.ajax({
                type: "post",
                url: urlList.contextPath + urlList.showMsg,
                dataType: "json",
                data: {
                    friendId: $loginId
                }
            }).done(function (result) {
                console.log(result);

                var source = $("#receive-message-template").html();
                var template = Handlebars.compile(source);

                var data = result.msgList;
                data.messageCnt = result.msgList.length;

                Handlebars.registerHelper("setMessageCnt", function (messageCnt) {
                    if(messageCnt !== 0) {
                        return "<span class=\"label label-warning\">" + messageCnt + "</span>";
                    }
                });
                Handlebars.registerHelper("setProfileImg", function (friendId) {
                    return profileImg.setUserImg(friendId);
                });
                Handlebars.registerHelper("setProfileInfo", function (friendId) {
                    return notificationModule.setFriendInfo(friendId);
                });
                Handlebars.registerHelper("setTime", function (regDate) {
                    return notificationModule.setTimeFlow(regDate);
                });

                var html = template(data);
                $("#receiveMessage").html(html);
            });
        },
        confirm: function (friendId, check) {
            $.ajax({
                type: "post",
                url: urlList.contextPath + urlList.confirm,
                data: {
                    userId: $loginId,
                    friendId: friendId,
                    confirm: check
                }
            }).done(function () {
                notificationModule.notification();
                friend.list();
            });
        },
        setFriendInfo: function (friendId) {
            var returnVal = "";
            $.ajax({
                url: urlList.contextProfilePath + urlList.profile,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId : friendId
                }
            }).done(function (result) {
                returnVal = result.userInfo.name;
            });
            return returnVal;
        },
        setRequestTime: function (friendId) {
            var returnVal = "";
            $.ajax({
                url: urlList.contextPath + urlList.requestTime,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId: $loginId,
                    friendId: friendId
                }
            }).done(function (result) {
                returnVal = notificationModule.setTimeFlow(result);
            });
            return returnVal;
        },
        setTimeFlow: function (result) {
            var returnVal = "";

            var date = new Date(result);
            var timeDifference = Math.floor( (new Date().getTime() - date.getTime()) / 1000 );
            returnVal = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

            if(timeDifference < 60) {
                returnVal = Math.floor(timeDifference) + "초 전";
            }
            else if(timeDifference < (60 * 60)) {
                returnVal = Math.floor( (timeDifference / 60) ) + "분 전";
            }
            else if(timeDifference < (60 * 60 * 24)) {
                returnVal = Math.floor( (timeDifference / (60 * 60)) ) + "시간 전";
            }
            else if(timeDifference < (60 * 60 * 24 * 3)) {
                returnVal = Math.floor( (timeDifference / (60 * 60 * 24)) ) + "일 전";
            }

            return returnVal;
        }
    };
    notificationModule.init();

    return {
        confirm: notificationModule.confirm,
        setFriendPhoto: notificationModule.setFriendPhoto,
        setFriendInfo: notificationModule.setFriendInfo,
        message: notificationModule.message
    }
})();

