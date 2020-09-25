import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import assign from 'lodash/assign';

import {
  HOSTING_CDN_ORDER_CDN_VERSION_V1,
  HOSTING_CDN_ORDER_CDN_VERSION_V2,
} from './hosting-cdn-order.constant';

export default /* @ngInject */ ($stateProvider) => {
  const resolve = {
    /* @ngInject */
    autoPayWithPreferredPaymentMethod: (ovhPaymentMethod) =>
      ovhPaymentMethod.hasDefaultPaymentMethod(),

    catalogAddons: /* @ngInject */ (user, WucOrderCartService) =>
      WucOrderCartService.getProductPublicCatalog(
        user.ovhSubsidiary,
        'webHosting',
      ),

    catalogAddon: /* @ngInject */ (
      goBackWithError,
      serviceOption,
      user,
      $translate,
      HostingCdnOrderService,
    ) =>
      HostingCdnOrderService.getCatalogAddon(
        user.ovhSubsidiary,
        serviceOption,
      ).catch((error) => goBackWithError(get(error, 'data.message', error))),

    goBack: /* @ngInject */ (goToHosting) => goToHosting,

    goBackWithError: /* @ngInject */ ($translate, goBack) => (error) =>
      goBack(
        $translate.instant('hosting_dashboard_cdn_order_error', {
          message: error,
        }),
        'danger',
      ),

    isOptionFree: /* @ngInject */ (serviceOption) =>
      serviceOption.planCode === 'cdn_free_business',

    serviceName: /* @ngInject */ ($transition$) =>
      $transition$.params().productId,

    serviceOption: /* @ngInject */ (availableOptions, goBackWithError) =>
      find(availableOptions, { family: 'cdn' }) ||
      goBackWithError('No serviceOption found'),

    serviceInfo: /* @ngInject */ (Hosting, serviceName) =>
      Hosting.getServiceInfos(serviceName),

    cdnProperties: /* @ngInject */ (
      HostingCdnSharedService,
      serviceName,
      goBack,
    ) => {
      return HostingCdnSharedService.getCDNProperties(serviceName)
        .then((cdn) => {
          if (cdn.version === HOSTING_CDN_ORDER_CDN_VERSION_V2) return goBack();
          return cdn;
        })
        .catch(() => null);
    },

    hasCDN: /* @ngInject */ (cdnProperties) => cdnProperties !== null,

    isV1CDN: /* @ngInject */ (cdnProperties, hasCDN) =>
      hasCDN && cdnProperties.version === HOSTING_CDN_ORDER_CDN_VERSION_V1,

    isIncludedCDN: /* @ngInject */ (cdnProperties, isV1CDN, isOptionFree) =>
      (isV1CDN && cdnProperties.free) || isOptionFree,

    isPayableCDN: /* @ngInject */ (cdnProperties, isV1CDN) =>
      isV1CDN && !cdnProperties.free,

    isV2CDN: /* @ngInject */ (cdnProperties, hasCDN) =>
      hasCDN && cdnProperties.version === HOSTING_CDN_ORDER_CDN_VERSION_V2,

    cdnCase: /* @ngInject */ (isIncludedCDN, isPayableCDN, hasCDN) => {
      if (isIncludedCDN) {
        return 'included';
      }
      if (isPayableCDN) {
        return 'payable';
      }
      if (!hasCDN) {
        return 'without';
      }
      return null;
    },
  };
  const rOrder = {
    prepareCart: /* @ngInject */ (
      goBackWithError,
      serviceName,
      serviceOption,
      user,
      $translate,
      HostingCdnOrderService,
    ) => async () => {
      try {
        const cartId = await HostingCdnOrderService.prepareOrderCart(
          user.ovhSubsidiary,
        );

        const cart = await HostingCdnOrderService.addItemToCart(
          cartId,
          serviceName,
          serviceOption,
        );

        return { cart, cartId };
      } catch (error) {
        goBackWithError(get(error, 'data.message', error));
        return {};
      }
    },

    checkoutCart: /* @ngInject */ (
      goBack,
      goBackWithError,
      isOptionFree,
      $translate,
      $window,
      HostingCdnOrderService,
    ) => async (autoPayWithPreferredPaymentMethod, cartId) => {
      try {
        const order = await HostingCdnOrderService.checkoutOrderCart(
          autoPayWithPreferredPaymentMethod,
          cartId,
        );

        if (isOptionFree) {
          return goBack(
            $translate.instant(
              'hosting_dashboard_cdn_order_success_activation',
            ),
          );
        }
        $window.open(order.url, '_blank');
        return goBack(
          $translate.instant('hosting_dashboard_cdn_order_success', {
            t0: order.url,
          }),
        );
      } catch (error) {
        return goBackWithError(get(error, 'data.message', error));
      }
    },
  };
  const rUpgrade = {
    prepareCart: /* @ngInject */ (
      goBackWithError,
      serviceName,
      serviceOption,
      user,
      $translate,
      HostingCdnOrderService,
      HostingCdnSharedService,
    ) => async () => {
      try {
        const cartId = await HostingCdnOrderService.prepareOrderCart(
          user.ovhSubsidiary,
        );
        const servInfo = await HostingCdnSharedService.getServiceInfo(
          serviceName,
        );
        const servOpts = await HostingCdnSharedService.getServiceOptions(
          servInfo.serviceId,
        );
        const { serviceId } = find(
          servOpts,
          ({ billing }) =>
            billing.plan.code.match('^cdn') &&
            billing.plan.code.match('_business$'),
        );
        const addonPlans = await HostingCdnSharedService.getCatalogAddonsPlan(
          serviceId,
        );
        const addonPlan = find(addonPlans, ({ planCode }) =>
          includes(['cdn_basic', 'cdn-basic-free'], planCode),
        );

        const { order } = await HostingCdnOrderService.simulateCartForUpgrade(
          cartId,
          serviceName,
          addonPlan,
          serviceId,
        );

        return { cart: order, cartId, addonPlan, serviceId };
      } catch (error) {
        goBackWithError(get(error, 'data.message', error));
        return {};
      }
    },

    checkoutCart: /* @ngInject */ (
      goBack,
      goBackWithError,
      isOptionFree,
      $translate,
      $window,
      HostingCdnOrderService,
    ) => async (autoPayWithPreferredPaymentMethod, addonPlan, serviceId) => {
      try {
        const {
          order,
        } = await HostingCdnOrderService.checkoutOrderCartForUpgrade(
          autoPayWithPreferredPaymentMethod,
          addonPlan,
          serviceId,
        );

        if (isOptionFree) {
          return goBack(
            $translate.instant(
              'hosting_dashboard_cdn_order_success_activation',
            ),
          );
        }
        $window.open(order.url, '_blank');
        return goBack(
          $translate.instant('hosting_dashboard_cdn_order_success', {
            t0: order.url,
          }),
        );
      } catch (error) {
        return goBackWithError(get(error, 'data.message', error));
      }
    },
  };

  $stateProvider.state('app.hosting.cdn.order', {
    url: '/order',
    component: 'hostingCdnOrder',
    resolve: assign({}, resolve, rOrder),
  });

  $stateProvider.state('app.hosting.cdn.upgrade', {
    url: '/upgrade',
    component: 'hostingCdnOrder',
    resolve: assign({}, resolve, rUpgrade),
  });
};
