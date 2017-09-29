
console.log("꾸꾸");
$(document).ready(function () {
    console.log("크크");
    document.addEventListener("deviceready", onDeviceReady, false);
});
function confirmExit() {
  var flag =   confirm("정말종료하시겠습니까??");
  if(flag)  cordova.exitApp();
}
function onDeviceReady() {
    document.addEventListener("backbutton", confirmExit, false);
    console.log("디바이스 레디됬다..");
    FCMPlugin.onNotification(
        function(data){
            console.log("onNotification data");
            console.dir(data);
            if (!data.wasTapped) {
                console.log("포그라운드 알람..");
                console.log(data);
                if(data.isData==="true"){
                    switch (data.whatNotic){
                        case "water" :
                            console.log("물알림왔다@@@");
                            console.log($chatbot);
                            $("#noticeBotNameA").html($chatbot);
                            $("#noticeContent").append(data.content);
                            $("#noticeFooter").html('<button type="button" class="btn btn-info btn-flat" data-dismiss="modal" style="width: 47%;" id="drinkBtn">마셨당</button><button type="button" class="btn btn-info btn-flat" data-dismiss="modal" style="width: 47%;">안마셨당</button>');
                            $("#notifiModal").modal();

                            break;
                        case "yasic" :
                            console.log("야식알림왔다@@@");
                            $("#noticeBotNameA").html($chatbot);
                            $("#noticeContent").append(data.content);
                            $noticeContent = data.content;
                        //    $("#noticeFooter").html('<button type="button" class="btn btn-info btn-flat" data-dismiss="modal"  onclick="pageLoad(\'chat.html\',\'chatLayer\'" style="width: 47%;" id="drinkBtn">얘기나누기</button><button type="button" class="btn btn-info btn-flat" data-dismiss="modal" style="width: 47%;">도망가기</button>');
                            $("#noticeFooter").html('<button type="button" class="btn btn-info btn-flat" data-dismiss="modal"  onclick="$(\'section.sidebar>ul.sidebar-menu>li>a\').click()" style="width: 47%;" id="drinkBtn">얘기나누기</button><button type="button" class="btn btn-info btn-flat" data-dismiss="modal" style="width: 47%;">도망가기</button>');
                            $("#notifiModal").modal();
                            break;
                    }


                }
                //포어그러운드일떄.. 띄워줄창!
                function notifiCallback() {
                    pageLoad('chat.html','chatLayer');
                }
            } else {
                //백그라운드에서 돌때...돌아서 들어왔을때...
                alert(JSON.stringify(data));
                console.log("백그라운드 알람..");
                console.log(data);
            }
        },
        function(msg){
           // alert('onNotification callback successfully registered: ' + msg);
            console.log('onNotification callback successfully registered: ' + msg);
        },
        function(err){
            console.log('Error registering onNotification callback: ' + err);
           // alert('Error registering onNotification callback: ' + err);
        }
    );

}

