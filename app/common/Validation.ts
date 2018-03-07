
interface IValidationScope extends ng.IScope {
    submitForm();
    validationRule: IValidationRule;
    waiting;
    errors: string[];
}

class Validation implements ng.IDirective {
    static directiveId: string = "validation";
    restrict: string = "A";

    constructor(private $window: ng.IWindowService) {
    }

    link = (scope: IValidationScope, element, attrs) => {
     
        $(element).validate($.extend({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            invalidHandler: (event, validator) => { //display error alert on form submit   
                $('.alert-danger', $(element)).show();
            },

            highlight: e => { // hightlight error inputs
                if ($(e).closest('.form-group').length)
                    $(e).closest('.form-group').addClass('has-error'); // set error class to the control group
                else {
                    $(e).closest('div').addClass('has-error');
                }
            },

            success: label => {
                if (label.closest('.form-group').length)
                    label.closest('.form-group').removeClass('has-error');
                else {
                    label.closest('div').removeClass('has-error');
                }
                label.remove();
            },

            errorPlacement: (error, e) => {
                if ($(e).parent('label').length) { 
                    error.insertAfter($(e).parent('label'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(e.closest('.input-icon'));
                } else {
                    error.insertAfter(e);
                }
            },

            submitHandler: form => {
                scope.$apply(() => {
                    scope.submitForm();
                });
            }
        },
            scope.validationRule));


        $(element).find('input').keypress(e => {
            if (e.which === 13) {
                if ($(element).validate().form()) {
                    $(element).submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }
}

// Update the app1 variable name to be that of your module variable
app.directive(Validation.directiveId, ['$window', $window =>
    new Validation($window)
]);
app.directive('ccDatePicker', [
    "$parse", "$filter", ($parse: ng.IParseService, $filter: ng.IFilterService) => {

        return {
            scope: {
                ccObject: '=',
                ccModel: '='
            },
            restrict: 'AC',
            link: (scope: any, element, attrs) => {
                var model = scope.ccModel;
                var ready = false;
                var done = false;
                var modelSetter = $parse(model).assign;

                var data = $parse(model)(scope.ccObject);
                if (data && !done) {

                    var date1 = new Date(data);
                    if (date1.getFullYear() == 1)
                        date1 = new Date()
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

                $(element).change(() => {
                    var date = $(element).datepicker('getDate');
                    scope.$apply(() => {

                        if (date.getDate()) {
                            modelSetter(scope.ccObject, date);
                        } else {
                            modelSetter(scope.ccObject, "");
                        }
                    });
                });

            }
        };
    }
]);