/**
 * Created by Matthew on 13/07/2016.
 */
var ResetCtrl = function ($rootScope, $scope, $http) {
    $scope.data = {};
    $scope.waiting = 0;
    $scope.validationRule = {
        rules: {},
        messages: {}
    };
    $scope.submitForm = function () {
        $scope.waiting++;
        $http.post($rootScope.base_url + "api/accountCtrl/resetPassword", $scope.data).success(function (response) {
            window.location.href = $rootScope.base_url + 'account/password_change';
        }).error(function (error) {
            $scope.waiting--;
            $scope.error = error.message;
            $scope.error = error.message;
            $scope.$broadcast("showError");
        });
    }
};
ResetCtrl.$inject = [
    "$rootScope",
    "$scope",
    "$http"
];
app.controller("ResetCtrl", ResetCtrl);

var ResetPasswordCtrl = function ($rootScope, $scope, $http) {
    $scope.data = {};
    $scope.waiting = 0;
    $scope.validationRule = {
        rules: {
            cpassword: {
                equalTo: '#password'
            }
        },
        messages: {
            cpassword: {
                equalTo: 'Password do not match'
            }
        }
    };
    $scope.submitForm = function () {
        $scope.waiting++;
        $http.put($rootScope.base_url + "api/accountCtrl/passwordReset", $scope.data).success(function (response) {
            window.location.href = $rootScope.base_url + '/home/password_change';
        }).error(function (error) {
            $scope.waiting--;
            $scope.error = error.message;
            $scope.$broadcast("showError");
        });
    }
};
ResetPasswordCtrl.$inject = [
    "$rootScope",
    "$scope",
    "$http"
];
app.controller("ResetPasswordCtrl", ResetPasswordCtrl);