app.factory('ResponseInterceptorSvc', ['$q', '$location',
    function ($q, $location) {
        return {
            response: function (response) {
                // do something on success
                return response;
            },
            responseError: function (response) {
                switch (response.status) {
                    case 400:// if the status is 400 we return the error
                        // $state.go('Error500');
                        break;
                    case 404:
                        //alert(JSON.stringify(response))
                        //   $location.path('/error_404');
                        break;
                    case 401:// if the status is 401 we return access denied
                        if (localStorage.getItem('token')) {
                            localStorage.removeItem('token');
                        }
                        window.location.href = 'account/login';
                        break;
                    case 403:// if the status is 403 we tell the user that authorization was denied
                        break;
                    case 500:// if the status is 500 we return an internal server error message
                        // if (response.data && response.data.exceptionMessage) {
                        //     alert(response.data.exceptionMessage);
                        // } else {
                        //     $location.path('/error_500');
                        // }
                        break;
                    default:// for all other errors we display a default error message
                        break;
                }
                return $q.reject(response);
            }
        };
        // return function (promise) {
        //     console.log(promise);
        //     alert("promise recived");
        //     return promise.then(
        //         (response) => {
        //             alert("success")
        //             return response;
        //         },
        //         (response) => {
        //         alert("error");
        //             console.log(response);
        //             switch (response.status) {
        //                 case 400: // if the status is 400 we return the error
        //                     // $state.go('Error500');
        //                     break;
        //                 case 404:
        //                     alert(JSON.stringify(response))
        //                     //   $location.path('/error_404');
        //                     break;
        //                 case 401: // if the status is 401 we return access denied
        //                     if (localStorage.getItem('token')) {
        //                         localStorage.removeItem('token');
        //                     }
        //                     $location.path('/account');
        //                     break;
        //                 case 403: // if the status is 403 we tell the user that authorization was denied
        //
        //                     break;
        //                 case 500: // if the status is 500 we return an internal server error message
        //                     if (response.data && response.data.exceptionMessage) {
        //                         alert(response.data.exceptionMessage);
        //                     } else {
        //                         $location.path('/error_500');
        //                     }
        //                     break;
        //                 default: // for all other errors we display a default error message
        //                     break;
        //             }
        //             return $q.reject(response);
        //         });
        // };
    }]);
//# sourceMappingURL=ResponseInterceptorSvc.js.map