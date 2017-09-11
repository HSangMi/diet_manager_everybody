function PhotoInfo(timestamp, data){
    this.timestamp = timestamp;
    this.data= data;
}
var photoList = [];
var sendPhoto;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        console.log("test");

        // var recentTime = 1503241200000;
        sendPhoto = function (recentTime) {
            var albumIds = [];
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
                                    data: {"photoList": JSON.stringify(photoList)},
                                    dataType: "json",
                                    type: "POST"
                                }).done(function (result) {
                                    console.log(result);
                                }).fail(function (err) {
                                    console.dir(err);
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
        };


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







//
// var app = {
//     // Application Constructor
//     initialize: function() {
//         document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//     },
//
//     // deviceready Event Handler
//     //
//     // Bind any cordova events here. Common events are:
//     // 'pause', 'resume', etc.
//     onDeviceReady: function() {
//         this.receivedEvent('deviceready');
//     },
//
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');
//
//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');
//
//         console.log('Received Event: ' + id);
//     }
// };
//
// app.initialize();