var profile = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/user/setting/",
        "profile": "profile.do",
        "update": "update.do",
        "alarm": "alarm.do",
        "updateAlarm": "updateAlarm.do"
    };
    /* 알림 체크 */
    var profileModule = {
        init: function () {
            profileModule.bindEvent();
            profileModule.alarm();
            profileModule.showProfile();
        },
        bindEvent: function () {
            // 알림 설정
            $(document.body).on("change", "#pushA", function () {
                profileModule.updateAlarm($("#pushA"))
            });
            $(document.body).on("change", "#waterA", function () {
                profileModule.updateAlarm($("#waterA"))
            });
            $(document.body).on("change", "#weightA", function () {
                profileModule.updateAlarm($("#weightA"))
            });
            // 프로필 사진
            $(document.body).on("click", "#insertImg", function () {
                $("#attachFile").trigger("click");
            });
            $(document.body).on("change", "#attachFile", function () {
                var f = this.files[0];
                /*
                if(f.size>100*1000) {
                    alert("사진 크기가 너무커");
                    return ;
                }
                */
                var imageType = "image/gif:image/jpeg:image/JPG:image/png";
                if (imageType.indexOf(f.type) === -1) {
                    alert("지원하지않는 타입의 파일입니다.");
                    return;
                } else {
                    $("#profile_Edit").attr("src", URL.createObjectURL(f));
                }
            });
        },
        /* 사용자 프로필 설정 */
        showProfile: function () {
            $.ajax({
                url: urlList.contextPath + urlList.profile,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId : /* 로그인 한 아이디 받아서 처리 */"admin"
                }
            }).done(function (result) {
                var source = $("#profile-template").html();
                var template = Handlebars.compile(source);

                var data = result.userInfo;
                var photoTemp = result.userPhoto;

                if(photoTemp) {
                    data.path = photoTemp.path;
                    data.sysName = photoTemp.sysName;
                    console.log("사용자 프로필 이미지 존재");
                }
                else {
                    // setting default image
                    data.path = "/default-img";
                    data.sysName = "20170905_134208.jpg";
                    console.log("프로필 이미지 없음");
                }

                Handlebars.registerHelper("setProfileImg", function (path, sysName) {
                    return file.preview(path, sysName);
                });
                
                var html = template(data);
                $("div#profileDiv").html(html);
            });
        },
        updateForm: function () {
            $.ajax({
                url: urlList.contextPath + urlList.profile,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId : /* 로그인 한 아이디 받아서 처리 */"admin"
                }
            }).done(function (result) {
                var source = $("#update-template").html();
                var template = Handlebars.compile(source);

                var data = result.userInfo;
                var photoTemp = result.userPhoto;

                if(photoTemp) {
                    data.path = photoTemp.path;
                    data.sysName = photoTemp.sysName;
                    console.log("사용자 프로필 이미지 존재");
                }
                else {
                    // setting default image
                    data.path = "/default-img";
                    data.sysName = "20170905_134208.jpg";
                    console.log("프로필 이미지 없음");
                }

                Handlebars.registerHelper("setProfileImg", function (path, sysName) {
                    return file.preview(path, sysName);
                });

                var html = template(data);
                $("div#profileDiv").html(html);
            });
        },
        update: function () {
            var fd = new FormData();

            var fileEle = $("input#attachFile")[0];
            if(fileEle.files) {
                console.log("파일 등록됨");
                fd.append("attachFile", fileEle.files[0]);
            }
            console.log(fileEle);

            fd.append("name", $("#inputName").val());
            fd.append("statMsg", $("#statMsg").val());
            fd.append("tall", $("#tall").val());
            fd.append("weight", $("#weight").val());
            fd.append("userId", /* 로그인 한 아이디 받아서 처리 */"admin");

            $.ajax({
                url: urlList.contextPath + urlList.update,
                dataType: "json",
                async: false,
                method: "post",
                data: fd,
                processData: false,
                contentType: false
            }).done(profileModule.showProfile);
        },
        alarm: function () {
            $.ajax({
                url: urlList.contextPath + urlList.alarm,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId : /* 로그인 한 아이디 받아서 처리 */"admin"
                }
            }).done(function (result) {
                var source = $("#alarm-template").html();
                var template = Handlebars.compile(source);

                Handlebars.registerHelper("setChecked", function (alarm) {
                    if(alarm === 1) {
                        return "checked";
                    }
                });

                var html = template(result.userInfo);
                $("div#settingAlarm").html(html);
            });
        },
        updateAlarm: function ($switch) {
            var updateVal = 0;
            if($switch.prop("checked") === true) {
                updateVal = 1;
            }

            $.ajax({
                url: urlList.contextPath + urlList.updateAlarm,
                data: {
                    updateName: $switch[0].id,
                    updateVal: updateVal,
                    userId: /* 로그인 한 유저 아이디로 변경 */"admin"
                },
                method: "post"
            }).done();
        }
    };

    profileModule.init();

    return {
        showProfile: profileModule.showProfile,
        updateForm: profileModule.updateForm,
        update: profileModule.update
    }
})();