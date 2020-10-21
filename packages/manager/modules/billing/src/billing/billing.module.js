import angular from 'angular';
import set from 'lodash/set';

import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

// import autorenew from './autoRenew/autorenew.module';
import featureAvailability from './billing-feature-availability';
import main from './main';
// import order from './order/billing-order-tracking.module';
// import orders from './orders/orders.module';
// import sla from './sla/sla.module';
// import termination from './confirmTerminate/termination.module';
// import paymentMehtod from './payment/method';

import billingCtrl from './billing.controller';
import config from './config/config';
import routing from './billing.routing';

const moduleName = 'ovhManagerBilling';

angular
  .module(moduleName, [
    ovhManagerCore,
    // autorenew,
    // 'Billing.constants',
    // 'Billing.controllers',
    // 'Billing.directives',
    // 'Billing.filters',
    // 'Billing.services',
    main,
    // 'ngRoute',
    // 'ngSanitize',
    // order,
    // orders,
    ngOvhExportCsv,
    ngOvhUtils,
    // sla,
    // termination,
    // 'ui.bootstrap',
    // 'ui.router',
    // paymentMehtod,
  ])
  .controller('BillingCtrl', billingCtrl)
  .constant('BILLING_BASE_URL', 'billing/')
  .constant('Billing.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    paymentMeans: [
      'bankAccount',
      'paypal',
      'creditCard',
      'deferredPaymentAccount',
    ],
    target: config.target,
  })
  .constant('LANGUAGES', config.constants.LANGUAGES)
  .constant('Billing.URLS', {
    renew: config.constants.billingRenew,
  })
  .config(routing)
  .service('billingFeatureAvailability', featureAvailability)
  .run(
    /* @ngInject */ ($rootScope, coreConfig) => {
      set($rootScope, 'worldPart', coreConfig.getRegion());
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(() => {
    console.log('run in billing module');
  });

  export default moduleName;