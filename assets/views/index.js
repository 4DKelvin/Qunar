(function (Vue, $, api) {
    window.vm = new Vue({
        el: '#index',
        data: {
        },
        methods: {
        },
        ready: init(function () {
            $.scope().banners$$load();
        })
    });
})(Vue, Zepto, jQuery.api);