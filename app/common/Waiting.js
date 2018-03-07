var App;
var Waiting = (function () {
    function Waiting($window) {
        this.$window = $window;
        this.restrict = "A";
        this.link = function (scope, element, attrs) {
            scope.$watch('waiting', function (newValue) {
                if (newValue >= 1) {
                    $(element).waitMe({
                        effect: 'win8_linear',
                        text: 'Please wait...',
                        bg: 'rgba(255,255,255,0.7)',
                        color: '#985f0d'
                    });
                }
                else {
                    $(element).waitMe('hide');
                }
            });
        };
    }
    Waiting.directiveId = "waiting";
    return Waiting;
}());
// Update the app1 variable name to be that of your module variable
app.directive(Waiting.directiveId, ['$window', function ($window) {
        return new Waiting($window);
    }
]);
//# sourceMappingURL=Waiting.js.map