import controller from './hosting-cdn-shared-settings.controller';
import template from './hosting-cdn-shared-settings.html';

export default {
  controller,
  template,
  bindings: {
    domainOptions: '<',
    serviceName: '<',
    domainName: '<',
    domain: '<',
    goBack: '<',
    displayCreateCacheRuleModal: '<',
    displayUpdateCacheRuleModal: '<',
    displayConfirmSettingsModal: '<',
  },
  controllerAs: '$ctrl',
};
