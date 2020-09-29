import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import labs from '../../../components/project/labs';

import jobs from './jobs';
import data from './data';
import dashboard from './dashboard';

import onboarding from './onboarding';
import component from './training.component';
import routing from './training.routing';
import service from './training.service';
import jobService from './job.service';
import dataService from './data.service';

const moduleName = 'ovhManagerPciTraining';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    labs,
    jobs,
    onboarding,
    data,
    dashboard,
  ])
  .config(routing)
  .component('pciProjectTraining', component)
  .service('PciProjectTrainingService', service)
  .service('PciProjectTrainingJobService', jobService)
  .service('PciProjectTrainingDataService', dataService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;