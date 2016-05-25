export default function StreamPlayerDirective() {
  'ngInject';

  let directive = {
    restrict: 'A',
    scope: {
        stream: '='
    },
    link: ($scope, element) => {
      element.srcObject = $scope.stream;
    }
  };

  return directive;
}
