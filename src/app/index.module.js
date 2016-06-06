/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';
import VideoCreationController from './videoCreation/videoCreation.controller';
import RecorderService from '../app/components/recorder/recorder.service';
import UserMediaService from '../app/components/userMedia/userMedia.service';
import StreamPlayerDirective from '../app/components/streamPlayer/streamPlayer.directive';
import GetUserMediaService from '../app/components/getUserMedia/getUserMedia.service';

angular.module('angularMsrVideoPoc', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngRoute', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
	.service('recorder', RecorderService)
	.service('userMedia', UserMediaService)
	.service('getUserMedia', GetUserMediaService)
  .controller('MainController', MainController)
	.controller('VideoCreationController', VideoCreationController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('streamPlayer', StreamPlayerDirective)
  .filter('videoUrl', function ($sce) {
    return function(filename) {
      return $sce.trustAsResourceUrl('http://localhost:59161/uploads/' + filename);
    };
  });
