/**
 * Created by Matthew on 13/07/2016.
 */
var LoginCtrl = function ($scope, $http,errorHandler) {
    $scope.data = {};
    $scope.waiting = 0;
    $scope.errors=[];
    $scope.submitForm = function () {
        $scope.waiting++;
        $http.post($scope.base_url+"api/token", $scope.data).success(function (response) {
            $scope.waiting--;
            window.location.href = $scope.base_url + 'portal';
        }).error(function (error) {
            $scope.waiting--;
            $scope.errors = errorHandler.handleError(error);
            console.log($scope.errors)
           // $scope.$broadcast("showError");
        });
    }
};
LoginCtrl.$inject = [
    "$scope",
    "$http",
    "errorHandler"
];
app.controller("LoginCtrl", LoginCtrl);

