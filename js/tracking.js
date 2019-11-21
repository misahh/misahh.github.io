'use strict'
var app = angular.module('tracking', []);
var api_url = '/track/track.php';
var locationHref = window.location.href;

function onloadCallback(){
    grecaptcha.render("trackbutton",{sitekey:"6Lf1DSwUAAAAAGnxZN2KrWcwc5KZdrhwmEPVu0It",callback:trackBarcode});
}
app.controller('trackingController', function ($scope, $http, $timeout, $window ) {
    $scope.error='';
    $scope.barcode = '';
    $scope.resultTime = '';
    $scope.tmm = false;
    var barcode = '';
    var data = {};
    var response = '';


    $scope.track = function () {
        $scope.trackingStatuses = '';
        $scope.trackings = '';

        barcode = $scope.barcode;

        if (undefined !==barcode && barcode.length>13 && barcode.length<26 && /[\W_\s]/gi.test(barcode)){

            var barcode = barcode.replace(/[\W_\s]/gi,'');

            if (barcode.length===13 || barcode.length===17 || barcode.length===16) {
                $scope.barcode = barcode;
                $scope.track();
                return;
            } else {
                $scope.throwError();
            }
        } else if (undefined !==barcode && barcode.length>=26){
            var barcodes = barcode.split(/[\W_\s]/);
            barcodes = barcodes.filter(function(barcode) {
                return barcode.length == 13;
            });
            if (barcodes.length>30) {
                barcodes.length=30;
            }
            barcodes = barcodes.toString();
            var barcodesReq = barcodes.split(/,/);
            $scope.barcode = barcodes.replace(/,/gi, ' ');
            if ($scope.barcode.length===0) {
                $scope.throwError();
            }
            if (barcodes.length===13) {
                $scope.barcode = barcodes;
                $scope.track();
                return;
            }

            $scope.loading = true;
            data = {
                "barcode" : barcodes,
                "lang" : $scope.lang,
                "g-recaptcha-response" : response
            };
            $timeout(function () {
                $http.post(api_url,data).success(function(response) {
                    $scope.error='';
                    $scope.trackings = response.result;
                    $scope.from_to = response.from_to;
                    $scope.resultTime = response.result_time;
                    for(var k = 0; k <response.result.length; k++) {
                        for(var i = 0; i <barcodesReq.length; i++) {
                            if (response.result[k].barcode===barcodesReq[i]) {
                                barcodesReq.splice(i,1);
                            }
                        }
                    }
                    $scope.barcodesNotFind = barcodesReq;
                    $scope.loading = false;
                    grecaptcha.reset();
                });
            }, 1000, false);
        } else if ( (undefined !==barcode && barcode.length ===13 && (barcode).match(/^[a-zA-Z\d]{2}/) && (barcode).match(/[0-9]{9}/) && (barcode).match(/[a-zA-Z\d]{2}$/))
            || ( undefined !==barcode && barcode.length === 10 && (barcode).match(/[0-9]{10}/) )
            || ( undefined !==barcode && barcode.length === 13 && (barcode).match(/^[a-zA-Z]{4}/) && (barcode).match(/[0-9]{9}/) )
            || ( undefined !==barcode && barcode.length === 17 && (barcode).match('EWSUA') != null && (barcode).match(/[0-9]{10}/) && (barcode).match('YQ') != null)
            || ( undefined !==barcode && barcode.length === 12 && (barcode).match(/[0-9]{12}/) )
            || ( undefined !==barcode && barcode.length === 16 && (barcode).match('UA') != null && (barcode).match(/[0-9]{14}/) )
        ){

            //alert(barcode);

            $scope.barcodesReq = barcode;
            $scope.loading = true;
            data = {
                "barcode" : barcode,
                "lang" : $scope.lang,
                "g-recaptcha-response" : response
            };
            $timeout(function () {
                $http.post(api_url,data).success(function(response) {
                    $scope.error='';
                    $scope.trackingStatuses = response.result;
                    $scope.from_to = response.from_to;
                    $scope.resultTime = response.result_time;
                    if (undefined!==response.tmm) {
                        $scope.tmm = true;
                    } else {
                        $scope.tmm = false;
                    }
                    if (undefined!==response.ukrpost_barcode) {
                        $scope.ukrpostBarcode = response.ukrpost_barcode;
                    } else {
                        $scope.ukrpostBarcode = false;
                    }

                    $scope.loading = false;
                    grecaptcha.reset();
                });
            }, 1000, false);

        } else {
            $scope.throwError();
        }
    };

    $scope.throwError = function () {
        $scope.$apply(function () {
            $scope.error='Некоректний ідентифікатор поштового відправлення!';
        });
        grecaptcha.reset();
        return;
    };
    $scope.trackValidate = function () {
        $scope.error='';
        $scope.trackingStatuses = '';
        $scope.trackings = '';
        response = grecaptcha.getResponse();
        if (response.length>0) {
            $scope.track();
        }
    };

    $window.trackBarcode =  $scope.trackValidate;

    $window.onload= function() {
        var getBarcode = getParams('barcode');
        if (undefined !==getBarcode && getBarcode.length > 9) {
            $scope.barcode = getBarcode;
            document.getElementById('trackbutton').click();
        }
    };
});
//Get barcode
function getParams(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(locationHref))
        return decodeURIComponent(name[1]);
}
