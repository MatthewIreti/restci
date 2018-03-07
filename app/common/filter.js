filter.$inject = ["$window"];
function filter($window) {
    function link(scope, element, attrs) {
        scope.filterTemplate = attrs.filter;
    }
    return {
        restrict: "EA",
        link: link,
        templateUrl: "/partials/filter.html"
    };
}
angular.module("app").directive("filter", filter);
//# sourceMappingURL=filter.js.map