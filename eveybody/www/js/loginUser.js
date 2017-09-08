$(document.body).on("click", "a.scroll1", function () {
    $("a.scroll1").click(function () {
        $("div.form--login").hide();
        $("div.form--signup").show();

    });
});

$(document.body).on("click", "a.scroll2", function () {
    $("a.scroll2").click(function () {
        $("div.form--signup").hide();
        $("div.form--login").show();
    });
});

$(document.body).on("click", "a.loginBtn", function () {
    console.log("로그인 버튼누름")

    var userId = $("input#id").val();
    var pw = $("input#pw").val();

    $.ajax({
        url: "http://192.168.0.16:8000/user/login.do",
        data: {
            userId: userId,
            pw: pw
        },
        type: "POST",
        crossDomain: true
    }).done(function (result) {
        if (result === 'fail') {
            alert("입력하신 정보가 존재하지 않습니다.");
        } else {
            alert("로그인 성공!");
            if (!checkMobileDevice()) {
                window.sessionStorage.setItem("user", userId)
            } else {
                window.localStorage.setItem("user", userId);
            }

            var id = getLoginId();
            console.log("id = " + id);
            $(".modal1").click();
            window.location.reload();
        }
    });
});

$(document.body).on("click", "a.joinBtn", function () {
    $('a.joinBtn').on('click', function (event) {
        console.log("회원가입 버튼누름");
        console.log($("input#joinId").val(), $("input#joinPw").val());
        $.ajax({
            url: "http://192.168.0.16:8000/user/signIn.do",
            data: {
                userId: $("input#joinId").val(),
                pw: $("input#joinPw").val(),
                name: $("input#joinName").val()
            },
            type: "POST",
            crossDomain: true
        }).done(function (result) {
            console.dir(result);
            if (result === 'success') {
                alert("회원가입성공 성공!");
                $("div.form--signup").hide();
                $("div.form--login").show();
                $(".modal2").click();
            } else {
                alert("회원가입하는데 오류가 발생했습니다. 다시 시도해주세요.");
            }
        });
    });
});


function checkMobileDevice() {
    var mobileKeyWords = ['Android', 'iPhone', 'iPod', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson'];
    for (var info in mobileKeyWords) {
        if (navigator.userAgent.match(mobileKeyWords[info]) !== null) {
            return true;
        }
    }
    return false;
}


var getLoginId;
(getLoginId = function () {
    var userId = "";
    if (!checkMobileDevice()) {
        userId = window.sessionStorage.getItem("user");
    } else {
        userId = window.localStorage.getItem("user");
    }

    if (userId !== null && userId !== "") {
        $("ul>li>a#loginBtn").html("Logout")
            .attr("data-target", "#");
    } else {
        $("ul>li>a#loginBtn").html("Login")
            .attr("data-target", "#myModal1");
    }
    return userId;
})();

$(document.body).on("click", "ul>li>a#loginBtn", function () {
    $("ul>li>a#loginBtn").click(function () {

        if (this.innerHTML === "Logout") {
            $.ajax({
                url: "http://192.168.0.16:8000/user/logout.do",
                type: "POST",
                crossDomain: true
            }).done(function (result) {
                alert("로그아웃 되었습니다.");
                if (!checkMobileDevice()) {
                    window.sessionStorage.removeItem("user");
                } else {
                    window.localStorage.removeItem("user");
                }
                getLoginId();
            });
        }
    });
});

