(function (window, $, ui, Vue) {
    window.init = function (fn) {
        var targetWith = 375,
            scale = $(window).width() / targetWith;
        if (scale < 1) {
            $('meta[name=viewport]').attr({
                'content': 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no, target-densitydpi=high-dpi, minimal-ui'
            });
        }
        Vue.nextTick(function () {
            ui.init();
            (fn || $.noop)();
        });
    };
    window.getParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    };
    ui.scope = function () {
        return ui('.page')[0].__vue__;
    };
})(window, jQuery, Zepto, Vue);