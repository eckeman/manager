import kebabCase from 'lodash/kebabCase';

export default class {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.atInternet.trackClick({
      name: `autorenew::${kebabCase(this.serviceType)}::delete`,
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }

  terminate() {
    this.atInternet.trackClick({
      name: `autorenew::${kebabCase(this.serviceType)}::delete::confirm`,
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
    this.isDeleting = true;
    return this.terminateService()
      .then(() => this.onSuccess())
      .catch((error) => this.onError({ error }));
  }
}
