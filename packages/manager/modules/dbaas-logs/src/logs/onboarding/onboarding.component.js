import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  bindings: {
    orderLink: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
