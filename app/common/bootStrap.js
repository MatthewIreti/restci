var _this = this;
var toastr;
angular.module("app").run([
    '$rootScope', '$state', '$stateParams', 'errorHandler', 'NotificationService',
    function ($rootScope, $state, $stateParams, errorHandler, NotificationService) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$stateParams = $stateParams;
        $rootScope.errorHandle = errorHandler;
        $rootScope.notificationSvc = NotificationService;
        $rootScope.goToState = function (index) {
            if (!$rootScope.breadcrumbs[index].link)
                return;
            var config = $rootScope.breadcrumbs[index].config || $stateParams;
            $state.go($rootScope.breadcrumbs[index].link, config);
        };
        $rootScope.breadcrumbs = [];
        toastr.options = {
            "closeButton": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        $rootScope.yesNoList = [
            { value: true, name: "Yes" },
            { value: false, name: 'No' }
        ];
        $rootScope.roles = [
            { name: "Super Admin", value: 1 },
            { name: "System Admin", value: 2 },
            { name: "Sales Representative", value: 3 },
            { name: "Support Admin", value: 4 },
            { name: "Client", value: 5 },
        ];
        $rootScope.goToState = function (index) {
            var link = $rootScope.breadcrumbs[index];
            $state.go(link.link, (link.config || $stateParams));
        };
        $rootScope.logout = function () {
            $.removeCookie('token', { path: '/' });
            location.pathname = '/account';
        };
        $rootScope.goBack = function () {
            $rootScope.$state.go($rootScope.backLink.forwardLink || $rootScope.backLink.state, $.extend({}, $rootScope.$stateParams, _this.config, $rootScope.item));
        };
        $rootScope.opened = {};
        $rootScope.openDate = function ($event, property) {
            $event.preventDefault();
            $event.stopPropagation();
            $rootScope.opened[property] = true;
        };
        $rootScope.userRoles = {
            Admin: 1,
            SystemAdmin: 2,
            SalesRep: 3,
            SupportAdmin: 4,
            Client: 5
        };
        $rootScope.pageSize = [
            { id: 50, name: 50 },
            { id: 100, name: 100 },
            { id: 200, name: 200 },
            { id: 500, name: 500 }
        ];
        $rootScope.titleType = [
            { value: 1, name: "Chief" },
            { value: 2, name: "Dr." },
            { value: 3, name: "Mr." },
            { value: 4, name: "Mrs" },
            { value: 5, name: "Miss" }
        ];
        $rootScope.tinymceOptions = {
            onChange: function (e) {
                // put logic here for keypress and cut/paste changes
            },
            init_instance_callback: function (e) {
                $("#" + e.id).css({
                    position: 'absolute',
                    visibility: 'collapse',
                    height: 0,
                    width: 0,
                    top: -100
                }).show();
                $("#" + e.id).html(tinyMCE.activeEditor.getContent());
            },
            setup: function (e) {
                e.on("change", function (editor, l) {
                    var textarea = $("#" + e.id).prev().removeClass('has-error');
                    //remove has error from form-group
                    textarea.parent().parent().removeClass('has-error');
                    textarea.parent().find(".help-block").remove();
                    $("#" + e.id).html(e.getContent());
                });
            },
            plugins: 'textcolor link',
            toolbar: "sizeselect | bold italic | fontselect |  fontsizeselect | forecolor backcolor| alignleft aligncenter alignright alignjustify  | bullist numlist outdent indent |",
            forced_root_block: false
        };
    }
]);
var tinyMCE;
//# sourceMappingURL=bootStrap.js.map