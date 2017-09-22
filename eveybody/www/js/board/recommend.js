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
                if(getLoginId()!==null){
                    $(this).toggleClass('liked');
                }
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
                console.log("좋아요 갯수 : " + likeCnt);
                console.log("좋아요 했는지 :" + result.isLike);
                if(result.isLike !== 0) {
                    $(document).ready(function () {
                        console.log("liked class 추가");
                        $("a.like-button").addClass('liked');
                    });
                }
            });
            return likeCnt;
        },
        doLike: function (boardNo) {
            if(getLoginId()!==null){
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
                $("span.text-uppercase.margin-l-20 > span:nth-child(2)").text(result);
            });
            }else {
                alert("로그인 후 사용가능합니다.");
            }
        }
    };
    recommendModule.bindEvent();
    return {
        doLike: recommendModule.doLike,
        setLike: recommendModule.setLike
    }
})();