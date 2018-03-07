var app = angular.module('appDirective',[]);
app.directive('mixitup', function ($compile, $timeout) {
    function mixIt(element) {
        element.mixItUp({
            animation: {
                duration: 500,
                effects: 'stagger(100ms) fade translateY(-50%)',
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                staggerSequence: function (i) {
                    return (2 * i) - (5 * ((i / 3) - ((1 / 3) * (i % 3))));
                }
            }
        });
    }

    var linker = function (scope, element, attrs) {
        scope.$on("done", function () {
            $timeout(function () {
                if (element.mixItUp('isLoaded')) {
                    element.mixItUp('destroy', true);
                    mixIt(element);
                }
                mixIt(element);
            });
        });
    };
    return {
        restrict: 'A',
        link: linker
    };
});
// *********************  $Animate Itemas on Start  **********************/

app.directive('animated', function () {
    var linker = function (scope, elem, attr) {
        elem.appear(function () {
            var animation = elem.data('animation');
            if (!elem.hasClass('visible')) {
                var animationDelay = elem.data('animation-delay');

                if (animationDelay) {
                    setTimeout(function () {
                        elem.addClass(animation + " visible");
                    }, animationDelay);

                } else {
                    elem.addClass(animation + " visible");

                }
            }
        });

    };
    return {
        restrict: 'C',
        link: linker
    }
});
app.directive('autodismiss', function () {
    var linker = function (scope, elem, attr) {
        elem.addClass('hidden');
        scope.$on('showError', function () {
            elem.removeClass('hidden');
            setTimeout(function () {
                elem.addClass('hidden');
            }, 5000)
        });
    };
    return {
        restrict: 'A',
        link: linker
    }
});
app.directive('filters', function () {
    var isHidden = false;
    var toggle = function (elem, hidden) {
        var toggle_btn = elem.find('.toggle-btn');
        if (hidden) {
            hidden = false;
            elem.find('.panel-body').slideDown();
            toggle_btn.removeClass('fa-toggle-down').addClass('fa-toggle-up');
        } else {
            hidden = true
            elem.find('.panel-body').slideUp();
            toggle_btn.removeClass('fa-toggle-up').addClass('fa-toggle-down');
        }
        return hidden
    };
    var linker = function (scope, elem, attr) {
        var toggler = elem.find('span.pull-right');
        toggle(elem, isHidden);
        toggler.on('click', function () {
            isHidden = toggle(elem, isHidden);
        })
    };
    return {
        restrict: 'A',
        link: linker
    }
});
var Waiting = (function () {
    // Use: 'bounce' - default, none, rotateplane, stretch, orbit, roundBounce, win8, win8_linear, ios, facebook, rotation, timer, pulse, progressBar, bouncePulse, img.
    function Waiting($window) {
        this.$window = $window;
        this.restrict = "A";
        this.link = function (scope, element, attrs) {
            scope.$watch('waiting', function (newValue) {
                if (newValue >= 1) {
                    $(element).waitMe({
                        effect: 'roundBounce',
                        text: '',
                        bg: 'rgba(255,255,255,0.7)',
                        color: '#0aa89e'
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
app.directive('requestRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            readonly: '@',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({filled: i < scope.ratingValue});
                }
            };

            scope.toggle = function (index) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.ratingValue = index + 1;
                scope.onRatingSelected({rating: index + 1});
            };

            scope.$watch('ratingValue', function (newVal, oldVal) {
                if (newVal || newVal === 0) {
                    updateStars();
                }
            });
        }
    }
});
app.directive('ccTimePicker', ["$parse", "$filter", function ($parse, $filter) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            var model = attrs.ccModel;
            var stop = false;
            scope.$watch('waiting', function (newValue, oldValue) {
                if (newValue === 0) {
                    $(element).timepicker({
                        minuteStep: 1,
                        secondStep: 5,
                        showInputs: false,
                        showSeconds: false,
                        showMeridian: true
                    });
                    var time = ($parse(model)(scope));
                    $(element).timepicker('setTime', time);
                    $(element).timepicker().on('changeTime.timepicker', function (e) {
                        scope.$apply(function () {
                            $parse(model).assign(scope, e.time.value);
                        });
                    });
                }
            });
        }
    };
}]);
var Validation = (function () {
    function Validation($window) {
        this.$window = $window;
        this.restrict = "A";
        this.link = function (scope, element, attrs) {
            $(element).validate($.extend({
                errorElement: 'span',
                errorClass: 'help-block',
                focusInvalid: false,
                invalidHandler: function (event, validator) {
                    $('.alert-danger', $(element)).show();
                },
                highlight: function (e) {
                    if ($(e).closest('.form-group').length)
                        $(e).closest('.form-group').addClass('has-error'); // set error class to the control group
                    else {
                        $(e).closest('div').addClass('has-error');
                        //alert('');
                    }
                },
                success: function (label) {
                    if (label.closest('.form-group').length)
                        label.closest('.form-group').removeClass('has-error');
                    else {
                        label.closest('div').removeClass('has-error');
                    }
                    label.remove();
                },
                errorPlacement: function (error, e) {
                    if ($(e).parent('label').length) {
                        error.insertAfter($(e).parent('label'));
                    }
                    else if (element.closest('.input-icon').size() === 1) {
                        error.insertAfter(e.closest('.input-icon'));
                    }
                    else {
                        error.insertAfter(e);
                    }
                },
                submitHandler: function (form) {
                    scope.$apply(function () {
                        scope.submitForm();
                    });
                }
            }, scope.validationRule));
            $(element).find('input').keypress(function (e) {
                if (e.which == 13) {
                    if ($(element).validate().form()) {
                        $(element).submit(); //form validation success, call ajax form submit
                    }
                    return false;
                }
            });
        };
    }

    Validation.directiveId = "validation";
    return Validation;
})();
// Update the app1 variable name to be that of your module variable
app.directive(Validation.directiveId, ['$window', function ($window) {
    return new Validation($window);
}
]);
//# sourceMappingURL=Validation.js.map

filter.$inject = ["$window", "Constants"];
function filter($window, Constants) {
    return {
        restrict: "EA",
        link: link,
        templateUrl: Constants.baseUrl + "/app/partials/filter.html"
    };
    function link(scope, element, attrs) {
        scope.filterTemplate = attrs.filter;
    }
}
app.directive("filter", filter);
app.directive('a',
    function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        }
            ;
    });