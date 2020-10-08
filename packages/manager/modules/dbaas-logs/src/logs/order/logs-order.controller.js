export default class LogsOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $state,
    $anchorScroll,
    $translate,
    ovhDocUrl,
    coreConfig,
    atInternet,
    CucOrderHelperService,
    LogsConstants,
  ) {
    this.$http = $http;
    this.$anchorScroll = $anchorScroll;
    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.atInternet = atInternet;
    this.region = coreConfig.getRegion();
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.ovhDocUrl = ovhDocUrl;
  }

  $onInit() {
    this.regions = [];
    this.isLoading = true;
    this.orderError = false;
    this.orderSucceed = false;
    this.selectedOffer = undefined;
    this.selectedDatacenter = undefined;
    this.workflowOptions = {
      catalog: this.catalog,
      catalogItemTypeName: 'plans',
      productName: 'logs',
      getPlanCode: () => {
        return this.selectedOffer;
      },
      onGetConfiguration: () => {
        return [
          {
            label: 'region',
            value: this.selectedDatacenter,
          },
        ];
      },
    };
    this.standardPlanPrice = {
      FirstStep: { price: '' },
      SecondStep: { price: '' },
    };
    this.enterprisePlanPrice = {};
  }

  selectOffer(offerName) {
    const { plans } = this.workflowOptions.catalog;
    const selectedPlan = plans.find((plan) => plan.planCode === offerName);
    const regions = selectedPlan.configurations.find(
      (config) => config.name === 'region',
    ).values;
    this.regions = regions;
  }

  onOrderSucceed() {
    this.orderError = false;
    this.orderSucceed = true;
    this.atInternet.trackClick({
      name: `dbaas::logs::order::${
        this.selectedOffer === this.LogsConstants.LDP_PLAN_CODE
          ? 'activate'
          : 'pay'
      }`,
      type: 'action',
    });
    this.$anchorScroll('order-messages-anchor');
  }

  onOrderFail() {
    this.orderError = true;
    this.orderSucceed = false;
    this.$anchorScroll('order-messages-anchor');
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: guide.tracker,
      type: 'action',
    });
  }

  onSubmitOffer() {
    this.atInternet.trackClick({
      name: `dbaas::logs::order::step1_next_${this.selectedOffer}`,
      type: 'action',
    });
  }

  onSubmitLocation() {
    this.atInternet.trackClick({
      name: `dbaas::logs::order::step2_next_${this.selectDatacenter}`,
      type: 'action',
    });
  }
}
