import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';

const moduleName = 'ovhPlatformShDetailsLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('platform-sh.details.**', {
        url: '/details/:ovhPlatformShId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          console.log('lazyload');
          return import('./details.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
