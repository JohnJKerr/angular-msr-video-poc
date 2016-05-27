export default function StreamPlayerDirective() {
  'ngInject';

  let directive = {
    restrict: 'A',
    scope: {
      streamUri: '='
    },
    link: ($scope, element) => {
      $scope.$watch('streamUri', () => {
        if ($scope.streamUri) {
          element[0].setAttribute('src', $scope.streamUri);
          element[0].play();
        }
      });
    }
  };

  return directive;
}
