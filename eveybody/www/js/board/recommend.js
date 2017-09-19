var recommend = (function () {
    var urlList = {
        "contextPath": "http://192.168.0.16:8000/board/recommend/",
        "setLike": "setLike.do",
        "like": "like.do"
    };
    var recommendModule = {
        bindEvent: function () {
            // 추천
            $(document.body).on("click", "a.like-button", function() {
                $(this).toggleClass('liked');
            });
        },
        /* 추천 */
        setLike: function (boardNo) {
            var likeCnt = 0;
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.setLike,
                data: {
                    userId: getLoginId()
                },
                dataType: "json",
                async: false
            }).done(function (result) {
                likeCnt = result.likeCnt;
                if(result.isLike !== 0) {
                    $(document).ready(function () {
                        $("a.like-button").addClass('liked');
                    });
                }
            });
            return likeCnt;
        },
        doLike: function (boardNo) {
            var isLike = 0;
            if($("a.like-button.liked")[0]) {
                isLike = 1;
            }
            $.ajax({
                url: urlList.contextPath + boardNo + "/" + urlList.like,
                dataType: "json",
                data: {
                    isLike: isLike,
                    userId: getLoginId()
                },
                async: false
            }).done(function (result) {
                $("span.text-uppercase.margin-l-20 > span").text(result);
            });
        }
    };
    recommendModule.bindEvent();
    return {
        doLike: recommendModule.doLike,
        setLike: recommendModule.setLike
    }
})();