var bootbox;
var Notification = (function () {
    function Notification($http) {
        this.$http = $http;
    }

    Notification.prototype.showSuccessToast = function (message, title) {
        $.Notification.autoHideNotify('success', 'top right', title, message);
    };
    Notification.prototype.showErrorToast = function (message, title) {
        $.Notification.autoHideNotify('error', 'top right', title, message);
    };
    Notification.prototype.showWarningToast = function (message, title) {
        $.Notification.autoHideNotify('warning', 'top right', title, message);
    };
    Notification.prototype.showInfoToast = function (message, title) {
        $.Notification.autoHideNotify('info', 'top right', title, message);
    };
    Notification.prototype.bootBoxConfirm = function (message, callBack) {
        message = message || "Are you sure?";
        callBack = callBack || function () {
            };
        bootbox.confirm({
            message: message,
            callback: function (d) {
                if (d)
                    callBack();
            },
            size:"small"
        });
    };
    Notification.prototype.bootBoxAlert = function (message, callBack) {
        message = message || "Alert|";
        callBack = callBack || function () {
            };
        bootbox.alert(message, function () {
            callBack();
        });
    };
    Notification.prototype.bootBoxPrompt = function (message, callBack) {
        message = message || "What is your response?|";
        callBack = callBack || function () {
            };
        bootbox.prompt(message, function (d) {
            callBack(d);
        });
    };
    Notification.$inject = ["$http"];
    return Notification;
}());
angular.module("app").service("Notification", Notification);
//# sourceMappingURL=Notification.js.map