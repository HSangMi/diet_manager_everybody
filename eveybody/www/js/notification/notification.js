var notification = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/friend/",
        "contextProfilePath": "http://192.168.0.16:8000/user/setting/",
        "profile": "profile.do",
        "notification": "notification.do",
        "requestTime": "request-time.do",
        "confirm": "confirm.do"
    };
    /* 알림 체크 */
    var notificationModule = {
        init: function () {
            notificationModule.notification();
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
                    return notificationModule.setFriendPhoto(friendId);
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
        setFriendPhoto: function (friendId) {
            var returnImg = "";
            $.ajax({
                url: urlList.contextProfilePath + urlList.profile,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId : friendId
                }
            }).done(function (result) {
                var data = result;

                if(data.userPhoto) {
                    var photoTemp = data.userPhoto;
                    returnImg = file.preview(photoTemp.path, photoTemp.sysName);
                }
                else {
                    // setting default image
                    returnImg = file.preview("/default-img", "20170905_134208.jpg");
                }
            });
            return returnImg;
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
            });
            return returnVal;
        }
    };
    notificationModule.init();

    return {
        confirm: notificationModule.confirm,
        setFriendPhoto: notificationModule.setFriendPhoto,
        setFriendInfo: notificationModule.setFriendInfo
    }
})();