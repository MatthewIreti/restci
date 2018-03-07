app.config([
    '$urlRouterProvider',
    '$httpProvider', '$locationProvider', function ($urlRouterProvider, $httpProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path(), normalized = path.toLowerCase();
            if (path != normalized) {
                $location.replace().path(normalized);
            }
        });
        //$locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('ResponseInterceptorSvc');
        $httpProvider.interceptors.push('AuthInterceptorSvc');
    }
]);
//# sourceMappingURL=config.js.map