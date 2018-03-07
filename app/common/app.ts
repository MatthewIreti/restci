
let app = angular.module("app", [
    "ngResource",
    "ui.bootstrap",
    'ui.router',
    'ui.router.stateHelper',
    // 'ngFileUpload',
    'ngSanitize',
    // "appDirective",
    // "highcharts-ng",
    // "ui.tinymce",
    // "ngTagsInput"
], ($interpolateProvider)=>{
    $interpolateProvider.startSymbol("<%");
    $interpolateProvider.endSymbol("%>");
});

app.factory('errorHandler', function () {
    return {
        handleError: function (response) {
            var errors = [];
            var modelState;

            if (response.responseJSON) {
                errors.push(response.responseJSON.error_description);
            }
            else if (response.data) {
                if (response.data.modelState) {
                    modelState = response.data.modelState;
                    for (var key in modelState) {
                        errors = errors.concat(modelState[key]);
                    }
                }
                else if (response.data.message) {
                    errors.push(response.data.message);
                }
            }
            else if (response.message) {
                errors.push(response.message);
            }
            return errors;
        }
    }
})
app.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);