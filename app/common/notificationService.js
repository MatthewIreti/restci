// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var bootbox;
var toastr;
var NotificationService = (function () {
    function NotificationService($http) {
        this.$http = $http;
    }
    NotificationService.prototype.showSuccessToast = function (message, title) {
        toastr.success(message, title);
    };
    NotificationService.prototype.showErrorToast = function (message, title) {
        toastr.error(message, title);
    };
    NotificationService.prototype.showWarningToast = function (message, title) {
        toastr.warning(message, title);
    };
    NotificationService.prototype.showInfoToast = function (message, title) {
        toastr.info(message, title);
    };
    NotificationService.prototype.showConfirm = function (message, callBack) {
        message = message || "Are you sure?";
        callBack = callBack || function () { };
        bootbox.confirm(message, function (d) {
            if (d)
                callBack();
        });
    };
    NotificationService.$inject = ["$http"];
    return NotificationService;
}());
angular.module("app").service("NotificationService", NotificationService);
//# sourceMappingURL=notificationService.js.map