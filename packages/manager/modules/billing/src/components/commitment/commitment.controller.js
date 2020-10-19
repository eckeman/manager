export default class {
  /* @ngInject */
  constructor($q, BillingService, ovhPaymentMethod, RedirectionService) {
    this.$q = $q;
    this.BillingService = BillingService;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.paymentMethod = null;
    return this.$q
      .all({
        service: this.BillingService.getService(this.serviceId),
        engagement: this.BillingService.getEngagement(this.serviceId),
        hasPaymentMethod: this.ovhPaymentMethod.hasDefaultPaymentMethod(),
      })
      .then(({ hasPaymentMethod, service, engagement }) => {
        this.service = service;
        this.engagement = engagement;
        this.hasPaymentMethod = hasPaymentMethod;
      });
  }

  generatePaymentMethodUrl() {
    const callbackUrl = `${window.location.href}?duration=${this.duration}&payment=${this.payment}`;
    this.addPaymentMethodUrl = `${this.RedirectionService.getURL(
      'addPaymentMethod',
    )}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }
}
