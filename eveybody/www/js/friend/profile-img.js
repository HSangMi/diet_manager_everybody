var profileImg = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/user/setting/",
        "profile": "profile.do"
    };
    var profileImgModule = {
        setUserImg: function (userId) {
            var returnImg = "";
            $.ajax({
                url: urlList.contextPath + urlList.profile,
                dataType: "json",
                async: false,
                method: "post",
                data: {
                    userId: userId
                }
            }).done(function (result) {
                var data = result;

                if (data.userPhoto) {
                    var photoTemp = data.userPhoto;
                    returnImg = file.preview(photoTemp.path, photoTemp.sysName);
                }
                else {
                    // setting default image
                    returnImg = file.preview("/default-img", "20170905_134208.jpg");
                }
            });
            return returnImg;
        }
    };
    return {
        setUserImg: profileImgModule.setUserImg
    }
})();