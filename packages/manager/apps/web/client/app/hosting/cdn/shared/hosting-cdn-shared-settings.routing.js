import includes from 'lodash/includes';

import template from './leave-confirm-settings/leave/hosting-shared-leave-settings.html';
import controller from './leave-confirm-settings/leave/hosting-shared-leave-settings.controller';
import CdnSharedSettingsController from './hosting-cdn-shared-settings.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.cdn.shared', {
    url: '/shared/settings/:domainName',
    params: {
      domain: null,
    },
    component: 'hostingCdnSharedSettings',
    resolve: {
      goBack: /* @ngInject */ (goToHosting) => goToHosting,

      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().domainName,

      domainOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getCDNDomainsOptions(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      displayCreateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.cdn.shared.addCacheRule', params),

      displayUpdateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.cdn.shared.editCacheRule', params),

      displayConfirmSettingsModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.cdn.shared.confirmSettings', params),
    },
    onExit: ($transition$) => {
      const $q = $transition$.injector().get('$q');
      const $uibModal = $transition$.injector().get('$uibModal');
      const HostingCdnSharedService = $transition$
        .injector()
        .get('HostingCdnSharedService');
      const stateName = $transition$.to().name;
      const switches = CdnSharedSettingsController.getChangedSwitches(
        HostingCdnSharedService.model,
      );
      const rules = CdnSharedSettingsController.getChangedRules(
        HostingCdnSharedService.tasks,
      );
      const isValidState = includes(
        ['app.hosting.cdn.shared.addCacheRule'],
        stateName,
      );
      if (!isValidState && (switches.length || rules.length)) {
        return $q((resolve) => {
          $uibModal
            .open({
              template,
              controller,
              controllerAs: '$ctrl',
              resolve: {
                params: {
                  model: HostingCdnSharedService.model,
                  domain: {},
                  rules,
                },
              },
            })
            .result.then(() => {
              resolve(false);
            })
            .catch(() => {
              resolve();
            });
        });
      }

      return true;
    },
  });
};
