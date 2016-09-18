(function (document, $) {

    $.debug = window.location.hostname == 'localhost';
    /**
     * 基础api生成器
     * @param api 地址
     * @param params 数据
     * @param method
     * @returns {*}
     */
    $.promiseApi = function (api, params, method) {
        var defer = $.Deferred(),
            uri = $.debug ? 'http://localhost:3000/' : 'http://m.ddjiadian.com/',
            token = $.debug ? '59a7OSvEczjSpfAUIhCh+D6XBe7pxur7UUfY8IQaLNXxdIq0wgs8LLYKbqwT46rEsCQtf\/z+rF2BkFEQo91UuqGO20qiUoj24T7mK9SjWuElCtpl' : '';

        $.ajax({
            url: uri + api + '.php',
            data: $.extend(params, {
                access_token: token
            }),
            type: method ? method : "GET",
            dataType: 'JSON',
            cache: false,
            success: function (r) {
                ($.debug ? console.log : $.noop)(r);
                if (r.status == 200) {
                    defer.resolve(r.data);
                } else {
                    if (r.status == 10086) {
                        window.location.href = "/gzh/index.php?origin_url=" + encodeURIComponent(window.location.href);
                    }
                    defer.reject(r.msg);
                }
            },
            error: function (e) {
                ($.debug ? console.log : $.noop)(e);
                defer.reject('服务器出错');
            }
        });
        return defer.promise();
    };


    $.api = {
        /**
         * 自定义primise
         * @returns {*}
         */
        'promise': function () {
            return $.Deferred();
        }

    };

})(document, jQuery);
