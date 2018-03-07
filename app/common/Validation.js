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
                if (e.which === 13) {
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
}());
// Update the app1 variable name to be that of your module variable
app.directive(Validation.directiveId, ['$window', function ($window) {
        return new Validation($window);
    }
]);
app.directive('ccDatePicker', [
    "$parse", "$filter", function ($parse, $filter) {
        return {
            scope: {
                ccObject: '=',
                ccModel: '='
            },
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var model = scope.ccModel;
                var ready = false;
                var done = false;
                var modelSetter = $parse(model).assign;
                var data = $parse(model)(scope.ccObject);
                if (data && !done) {
                    var date1 = new Date(data);
                    if (date1.getFullYear() == 1)
                        date1 = new Date();
                    var dateString = $filter('date')(date1, 'dd/MM/yyyy');
                    if (date1.getDate()) {
                        $(element).val(dateString);
                        modelSetter(scope.ccObject, date1);
                    }
                }
                $(element).datepicker({
                    weekStart: 1,
                    todayHighlight: true,
                    format: "dd/mm/yyyy",
                    orientation: "left",
                    autoclose: true
                });
                $(element).change(function () {
                    var date = $(element).datepicker('getDate');
                    scope.$apply(function () {
                        if (date.getDate()) {
                            modelSetter(scope.ccObject, date);
                        }
                        else {
                            modelSetter(scope.ccObject, "");
                        }
                    });
                });
            }
        };
    }
]);
//# sourceMappingURL=Validation.js.map