$(document.body).on("click", "a.loginBtn", function () {
    console.log("로그인 버튼누름")

    var userId = $("input#id").val();
    var pw = $("input#pw").val();

    $.ajax({
        url:"http://192.168.0.16:8000/user/login.do",
        data:{
            userId : userId,
            pw : pw
        },
        type:"POST",
        crossDomain : true
    }).done(function(result){
        if(result === 'fail'){
            alert("입력하신 정보가 존재하지 않습니다.");
        }else{
            alert("로그인 성공!");
            if(!checkMobileDevice()){
                window.sessionStorage.setItem("user", userId)
            }else {
                window.localStorage.setItem("user", userId);
            }

            var id = getLoginId();
            console.log("id = " + id);
            $(".modal1").click();
            window.location.reload();
        }
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
(getLoginId = function (){
    var userId = "";
    if(!checkMobileDevice()){
        userId = window.sessionStorage.getItem("user");
    }else {
        userId = window.localStorage.getItem("user");
    }

    if(userId !== null && userId !== "" ){
        $("ul>li>a#loginBtn").html("Logout")
            .attr("data-target", "#");
    }else{
        $("ul>li>a#loginBtn").html("Login")
            .attr("data-target", "#myModal1");
    }
    return userId;
})();


$("ul>li>a#loginBtn").click(function(){

    if(this.innerHTML === "Logout"){
        $.ajax({
            url:"http://192.168.0.16:8000/user/logout.do",
            type:"POST",
            crossDomain : true
        }).done(function(result){
            alert("로그아웃 되었습니다.");
            if(!checkMobileDevice()){
                window.sessionStorage.removeItem("user");
            }else {
                window.localStorage.removeItem("user");
            }
            getLoginId();
        });
    }
});