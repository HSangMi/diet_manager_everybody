function PhotoInfo(timestamp, data){
    this.timestamp = timestamp;
    this.data= data;
}
var photoList = [];

// var sendPhoto;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        console.log("test");
        var albumIds = [];
        // if(loginFlag) {
         function sendPhoto(recentTime, userId) {
             Photos.collections({"collectionMode": "ALBUMS"},
                 function (albums) {
                     console.log("앨범", albums);
                     for (var j = 0; j < albums.length; j++) {
                         albumIds.push(albums[j].id);
                     }
                     Photos.photos(albumIds, {},
                         function (photos) {
                             console.log("1111");
                             var timeList = [];
                             var urlList = [];
                             for (var i = 0; i < photos.length; i++) {

                                 if (photos[i].timestamp >= recentTime) {
                                     var timestamp = (photos[i].timestamp);
                                     console.log(i, timestamp);
                                     timeList.push(timestamp);
                                     Photos.thumbnail(photos[i].id,
                                         {"asDataUrl": true, "dimension": 300, "quality": 60},
                                         function (data) {
                                             urlList.push(data);
                                             // dataUrls[i] = data;
                                         },
                                         function (error) {
                                             console.error("Error: " + error);
                                         });
                                 }
                             }
                             console.log("2222");
                             setTimeout(function () {
                                 for (var j = 0; j < urlList.length; j++) {
                                     photoList.push(new PhotoInfo(timeList[j], urlList[j]));
                                 }
                                 console.dir(photoList);

                                 console.log(JSON.stringify(photoList));
                                 $.ajax({
                                     url: "http://192.168.0.16:8000/views/utils/sendNewImages.json",
                                     // url: "http://192.168.0.22:3000/upload",
                                     data: {
                                         "photoList": JSON.stringify(photoList),
                                         userId : userId
                                     },
                                     dataType: "json",
                                     type: "POST",
                                     crossDomain: true,
                                     async:false
                                 }).done(function (result) {
                                     console.log("성공");
                                     console.log(result);
                                     location.replace("view/mybody/profile.html");
                                 }).fail(function (err) {
                                     console.dir(err);
                                     location.replace("view/mybody/profile.html");
                                 });
                             }, 1000);
                             console.log("3333");
                         }, console.error);
                     console.log("44444");
                     console.log(JSON.stringify(photoList));
                 },
                 function (error) {
                     console.error("Error: " + error);
                 });
         }

        // }

        $("a.loginBtn").click(function(){
            console.log("로그인 버튼누름");
            FCMPlugin.getToken(
                function(token){
                    console.log("token :"+ token);
                    var userId = $("input#id").val();
                    var pw = $("input#pw").val();
                    $.ajax({
                        url: "http://192.168.0.16:8000/user/login.do",
                        data: {
                            userId: userId,
                            pw: pw,
                            token: token
                        },
                        type: "POST",
                        crossDomain: true,
                        async:false
                    }).done(function (result) {
                        if (result === 'fail') {
                            alert("입력하신 정보가 존재하지 않습니다.");
                        } else {
                            alert("로그인 성공!");
                            window.localStorage.setItem("user", userId);
                            var recentDate = window.localStorage.getItem("recentDate");

                            $(".modal1").click();
                            if(recentDate !== null && recentDate !== ""){
                                // 사진 전송
                                sendPhoto(recentDate, userId);
                            }
                        }
                    });

                },
                function(err){
                    console.log('error retrieving token: ' + err);
                }
            );
        });

        if(checkMobileDevice()){    // 폰
            var userId = window.localStorage.getItem("user");
            var recentDate = window.localStorage.getItem("recentDate");

            console.log(userId);
            console.log(recentDate);

            // 자동로그인 됐을 때
            if(userId !== null && userId !== ""){
                sendPhoto(recentDate, userId);
                //1505835041000 / 1504310400000
                // sendPhoto(1504310400000, userId);
            }
            // 자동로그인 안 됐을 때
            else{
                if(recentDate !== null && recentDate !== ""){
                    $("button#loginModal").trigger('click');
                }else {
                    self.location="view/carousel.html";
                }
            }
        }else {
            window.sessionStorage.setItem("recentDate", new Date().getTime());
            self.location="view/main/main.html";
        }

        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        //
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};
app.initialize();
