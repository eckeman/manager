import { Service } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($q, $http) {
    this.$q = $q;
    this.$http = $http;
  }

  getService(serviceId) {
    return this.$http
      .get(`/services/${serviceId}`)
      .then(({ data }) => new Service(data));
  }

  getEngagement(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/billing/engagement`)
      .then(({ data }) => data)
      .catch((error) => (error.status === 404 ? null : this.$q.reject(error)));
  }
}
