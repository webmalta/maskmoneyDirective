(function() {
  'use strict';
  
   angular.module('app', [])

  .controller('appController', ['$scope', function($scope) {
    $scope.currencyVal = 100000;
  }])
  
  .directive('maskMoney', ['$locale', '$timeout', '$filter', function($locale, $timeout, $filter) {
      var _n = /[^0-9]/g;
      var _z = /^0+/;

      function _StringToNumber(string) {
        if (!string) { return 0; }
        return string.replace(_n, '').replace(_z, '') || 0;
      }

      function _StringToCurrency(string) {
        if (string !== undefined) {
		   string = string.toString();
		   if (parseFloat(string.replace(/(\$|\,)+/g, ''), 10) === 0) {
             return;
           }
        }

        if (string) {
          return $filter('currency')((_StringToNumber(string) / 100).toFixed(2), ''); }
      };

      // blur sem a virgula - aplicando o parse correto do JSON - no model - em casas decimais ao sair do campo
      function _toModel(val) {
          var value;
          var decimalSep = val.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP);
          if (decimalSep >= 5) {
             value = val.replace(/\./g, "").replace(/\,/g, ".");
          } else {
             value = val.replace(/\,/g, ".");
          }
          return value;
      }

      function link(scope, elem, attrs, model) {

        model.$formatters.unshift(() => {
          return $filter('currency')(model.$modelValue, '');
        });

        function setModel() {
           scope.$apply(() => {
             model.$setViewValue(_StringToCurrency(model.$modelValue));
             model.$render();
           });
        };
        elem.bind('blur', () => {
          model.$setViewValue(_toModel(elem.val()));
        });

        /* elem.bind('focus', function () {
          elem.val(model.$viewValue);
        }); */

        elem.bind('keyup', () => {
          setModel();
        });

        $timeout(() => {
           setModel();
        }, 500);
      }

      return {
        restrict: 'A',
        require: 'ngModel',
        link: link
      };
}]);
  
})();