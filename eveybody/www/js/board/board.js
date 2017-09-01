(function () {
    var urlList = {
        "contextPath" : "http://192.168.0.16:8000/board/tip/",
        "list" : "list.do"
    };
    var boardModule = {
        pageList: function (pageNo) {
            $.ajax({
                url: urlList.contextPath + pageNo + "/" + urlList.list,
                dataType: "json"
            }).done(boardModule.makePageList);
        },
        makePageList: function (result) {
            var data = result.list;
            if (data.length === undefined) {
                return;
            }
            var source = $("#list-template").html();
            var template = Handlebars.compile(source);

            Handlebars.registerHelper("setRegDate", function (regDate) {
                return new Date(regDate).format("{yyyy}/{MM}/{dd}");
            });
            var html = template(data);
            $("table > tbody").html(html);
            boardModule.makePageNav(result.page);
        },
        makePageNav(page) {
            var html = "";
            if (page.count !== 0) {
                var clz = "";
                if (page.prev === false) {
                    clz = "disabled";
                }
                html += '<li class="' + clz + '">';

                var fn = "";
                if (page.prev === true) {
                    fn = urlList.contextPath + (page.beginPage - 1) + "/" + urlList.list;
                }
                html += '<li><a href="' + fn + '" class="prev"><i class="fa fa-chevron-left"></i></a></li>';

                for (var i = page.beginPage; i <= page.endPage; i++) {
                    if (i === page.pageNo) {
                        html += '<li class="active"><a href="#1">' + i + '</a></li>';
                    } else {
                        html += '' + urlList.contextPath + i + "<li><a href="/">" + urlList.list + '' + i + '</a></li>';
                    }
                }

                clz = "";
                if (page.next === false) {
                    clz = "disabled";
                }
                html += '<li class="' + clz + '">';

                fn = "";
                if (page.next === true) {
                    fn = urlList.contextPath + (page.endPage + 1) + "/" + urlList.list;
                }
                html += '<li><a href="' + fn + '" class="next"><i class="fa fa-chevron-right"></i></a></li>';

                $("#pagination").html(html);
            }
        },

        writeForm : function () {
            var source = $("#write-template").html();
            var template = Handlebars.compile(source);

            var html = template();
            $("div.tbl-header table").html(html);
        }
    };
    // boardModule.pageList($("#pagination li a.active").text());
    boardModule.writeForm();
})();