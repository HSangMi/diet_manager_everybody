var file = (function () {
    var urlList = {
        "imagePath": "http://192.168.0.16:8888/kr.co.imageserver/upload",
        "list": "list.do",
        "write": "write.do",
        "update": "update.do",
        "delete": "delete.do"
    };
    var fileModule = {
        bindEvent: function () {
        },
        preview: function (path, sysName) {
            return urlList.imagePath + path + "/" + sysName;
        }
    };
    return {
        preview: fileModule.preview
    }
})();