import controller from './commitment.controller';
import template from './commitment.html';

export default {
  bindings: {
    callbackUrl: '<',
    goBack: '<',
    engagement: '<',
    serviceId: '<',
    duration: '<?',
    payment: '<?',
  },
  controller,
  template,
};
