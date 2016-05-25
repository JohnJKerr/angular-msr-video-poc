export function routerConfig ($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/', {
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
		.when('/video/add', {
			templateUrl: 'app/videoCreation/videoCreation.html',
			controller: 'VideoCreationController',
			controllerAs: 'videoCreation'
		})
    .otherwise({
      redirectTo: '/'
    });
}
