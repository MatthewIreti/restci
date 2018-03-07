
// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var bootbox;
var toastr;

interface INotificationService {

    showConfirm(message: string, callBack?: Function);
    showSuccessToast(message: string, title?: string);
    showErrorToast(message: string, title?: string);
    showInfoToast(message: string, title?: string);
    showWarningToast(message: string, title?: string);

}


class NotificationService implements INotificationService {
    static $inject: string[] = ["$http"];

    constructor(private $http: ng.IHttpService) {

    }

    showSuccessToast(message, title) {
        toastr.success(message, title);
    }

    showErrorToast(message, title) {
        toastr.error(message, title);
    }

    showWarningToast(message, title) {
        toastr.warning(message, title);
    }

    showInfoToast(message, title) {
        toastr.info(message, title);
    }

    showConfirm(message, callBack) {
        message = message || "Are you sure?";
        callBack = callBack || function() {};
        bootbox.confirm(message, (d) => {
            if (d)
                callBack();
        });
    }


}

angular.module("app").service("NotificationService", NotificationService);
