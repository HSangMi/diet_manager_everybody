var notification = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/friend/",
        "contextProfilePath": "http://192.168.0.16:8000/user/setting/",
        "profile": "profile.do",
        "notification": "notification.do",
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
                    userId: /* 로그인 한 아이디로 변경 */"admin"
                }
            }).done(function (result) {
                var source = $("#friend-request-template").html();
                var template = Handlebars.compile(source);

                var data = result;

                Handlebars.registerHelper("setProfileImg", function (friendId) {
                    return notificationModule.setFriendPhoto(friendId);
                });

                Handlebars.registerHelper("setProfileInfo", function (friendId) {
                    return notificationModule.setFriendInfo(friendId);
                });

                Handlebars.registerHelper("setTime", function (friendId) {
                    return notificationModule.setFriendInfo(friendId);
                });

                var html = template(data);
                $("#friendRequest").html(html);
            });
        },
        confirm: function (check) {
            $.ajax({
                type: "post",
                url: urlList.contextPath + urlList.requestCnt,
                dataType: "json",
                data: {
                    reqId: /* 로그인 한 아이디로 변경 */"admin",
                    resId: $("#searchIdTxt").val(),
                    confirm: check
                }
            }).done(/* alert 띄우기 OR 친구 신청 이후 처리 */);
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

                console.log(data);

                if(data.userPhoto) {
                    var photoTemp = data.userPhoto;
                    console.log("사용자 프로필 이미지 존재");
                    returnImt = file.preview(photoTemp.path, photoTemp.sysName);
                }
                else {
                    // setting default image
                    console.log("프로필 이미지 없음");
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
        }
    };
    notificationModule.init();
})();