$(document.body).on("click", "a.scroll1", function () {
    // $("a.scroll1").click(function () {
        $("div.form--login").hide();
        $("div.form--signup").show();

    // });
});

$(document.body).on("click", "a.scroll2", function () {
    // $("a.scroll2").click(function () {
        $("div.form--signup").hide();
        $("div.form--login").show();
    // });
});
//
$(document.body).on("click", "button.modal1", function () {

    $("input#id").val("");
    $("input#pw").val("");

    $("input#joinId").val("");
    $("input#joinName").val("");
    $("input#joinPw").val("");
    $("input#joinPwConfirm").val("");
    $("input#botName").val("");
    $("input[name='botMode']:radio[value='0']").prop("checked", "true");

    $("div.form--signup").hide();
    $("div.form--signup2").hide();
    $("div.form--login").show();
});


$(document.body).on("click", "a.loginBtn", function () {
    console.log("로그인 버튼누름");

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

            // var id = getLoginId();
            // console.log("id = " + id);
            // console.log(result);
            $(".modal1").click();
            window.location.reload();
        }
    });

});

function checkJoin() {
   if($("input#joinId").val()===""){
       alert("이메일을 입력해주세요.");
   }else if($("input#joinName").val()===""){
        alert("이름(별명)을 입력해주세요.");
   }else if($("input#joinPw").val()==="" || $("input#joinPwConfirm").val()===""){
        alert("비밀번호를 입력해주세요.");
   }else if($("input#chatbotName").val()===""){
       alert("챗봇이름을 입력해주세요.");
   }else if($("input#joinPw").val() !== $("input#joinPwConfirm").val()){
       alert("비밀번호가 일치하지 않습니다.");
   }

}

$(document.body).on("click", "a.joinBtn", function () {
    // $('a.joinBtn').on('click', function (event) {
        console.log("회원가입 버튼누름");
        // console.log($("input#joinId").val(), $("input#joinPw").val());
        $.ajax({
            url: "http://192.168.0.16:8000/user/signIn.do",
            data: {
                userId: $("input#joinId").val(),
                pw: $("input#joinPw").val(),
                name: $("input#joinName").val(),
                botName: $("input#botName").val()
                // mode:$("input[name='botMode']:checked").val()
            },
            type: "POST",
            crossDomain: true,
            beforeSend:checkJoin()
        }).done(function (result) {
            console.dir(result);
            if (result === 'success') {
                alert("EveryBody에 오신걸 환영합니다!");
                $("div.form--signup").hide();
                $("div.form--signup2").hide();
                $("div.form--login").show();
                $(".modal1").click();
            } else {
                alert("회원가입하는데 오류가 발생했습니다. 다시 시도해주세요.");
            }
        });


    // });
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


// 이걸 함수로 만든게 serve로 실행했을때 ul>li>a를 못찾아서!! ***********
var getLoginId = function () {
    var userId = "";
    if (!checkMobileDevice()) {
        userId = window.sessionStorage.getItem("user");
    } else {
        userId = window.localStorage.getItem("user");
    }

    console.log("storage의 user ID : " + userId);
    if (userId) {
        console.log("로그인해써");
        $("ul>li>a#loginBtn").html("Logout")
            .attr("data-target", "#");
    } else {
        console.log("로그인안해써");
        $("ul>li>a#loginBtn").html("Login")
            .attr("data-target", "#myModal1");
    }
    return userId;
};


$(document.body).on("click", "ul>li>a#loginBtn", function () {
    // $("ul>li>a#loginBtn").click(function () {

        if (this.innerHTML === "Logout") {
            $.ajax({
                url: "http://192.168.0.16:8000/user/logout.do",
                type: "POST",
                crossDomain: true
            }).done(function (result) {

                if (!checkMobileDevice()) {
                    window.sessionStorage.removeItem("user");
                } else {
                    window.localStorage.removeItem("user");
                }
                alert("로그아웃 되었습니다.");
                getLoginId();
            });
        }
    // });
});

