import includes from 'lodash/includes';
import find from 'lodash/find';

export default class HostingCdnSharedService {
  /* @ngInject */
  constructor($http, OvhHttp) {
    this.$http = $http;
    this.OvhHttp = OvhHttp;
  }

  /**
   * Get this object properties
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}:
   */
  getCDNProperties(serviceName) {
    return this.OvhHttp.get(`/hosting/web/${serviceName}/cdn`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * List available options for a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}:
   */
  getSharedCDNAvailableOptions(serviceName) {
    return this.OvhHttp.get(
      `/hosting/web/${serviceName}/cdn/availableOptions`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * List all domains for a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}:
   */
  getSharedCDNDomains(serviceName) {
    return this.OvhHttp.get(`/hosting/web/${serviceName}/cdn/domain`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Get details for a domain on a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  getSharedCDNDomainDetails(serviceName, domainName) {
    return this.OvhHttp.get(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * List all options for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  getCDNDomainsOptions(serviceName, domainName) {
    return this.OvhHttp.get(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * List all options for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {object} data: data to send
   * @returns {*}
   */
  addNewOptionToDomain(serviceName, domainName, data) {
    return this.OvhHttp.post(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option`,
      {
        rootPath: 'apiv6',
        data,
      },
    );
  }

  /**
   * Reset an option to his default value
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @returns {*}
   */
  resetCDNOptionToDefault(serviceName, domainName, optionName) {
    return this.OvhHttp.delete(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
      {
        rootPath: 'apiv6',
        data: {},
      },
    );
  }

  /**
   * Get details for an option on a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @returns {*}
   */
  getCDNDomainOptionDetails(serviceName, domainName, optionName) {
    return this.OvhHttp.get(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Update an option on a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @param {object} data: data to send
   * @returns {*}
   */
  updateCDNDomainOption(serviceName, domainName, optionName, data) {
    return this.OvhHttp.put(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
      {
        rootPath: 'apiv6',
        data,
      },
    );
  }

  /**
   * Update an option on a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @returns {*}
   */
  deleteCDNDomainOption(serviceName, domainName, optionName) {
    return this.$http.delete(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
    );
  }

  /**
   * Flush cache content on CDN for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  flushCDNDomainCache(serviceName, domainName) {
    return this.$http.post(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/purge`,
    );
  }

  /**
   * Trigger a refresh for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  refreshCDNDomain(serviceName, domainName) {
    return this.OvhHttp.post(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/refresh`,
      {
        rootPath: 'apiv6',
        data: {},
      },
    );
  }

  /**
   * List all operations for a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}
   */
  getCDNServiceOperations(serviceName) {
    return this.OvhHttp.get(`/hosting/web/${serviceName}/cdn/operation`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Get details for a Shared CDN operation
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} id: Id of the operation
   * @returns {*}
   */
  getSharedCDNServiceOperationDetails(serviceName, id) {
    return this.OvhHttp.get(`/hosting/web/${serviceName}/cdn/operation/${id}`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Enable/disable domain
   * @param {string} serviceName
   * @param {string} domain
   */
  enableDisableCDNDomain(serviceName, domain) {
    return this.OvhHttp.put(
      `/hosting/web/${serviceName}/attachedDomain/${domain}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Return service details
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}: promise
   */
  getServiceInfo(serviceName) {
    return this.OvhHttp.get(`/hosting/web/${serviceName}/serviceInfos`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Return service description
   * @param {number} serviceInfoId: get from serviceInfo
   * @returns {*}: promise
   */
  getServiceOptions(serviceInfoId) {
    return this.OvhHttp.get(`/services/${serviceInfoId}/options`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Return list of offers
   * @param serviceOptionsId: get from serviceOptions
   * @returns {*}: promise
   */
  getCatalogAddonsPlan(serviceOptionsId) {
    return this.OvhHttp.get(`/services/${serviceOptionsId}/upgrade`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * simulate an upgrade to shared CDN (CDNv2)
   * @param {number} serviceId: get from serviceOptions
   * @param {string} planCode: get from serviceOptions
   * @param {object} price: contains info for simulate the order
   * @returns {*}: promise
   */
  simulateUpgradeToSharedCDN(serviceId, planCode, price) {
    return this.OvhHttp.post(
      `/services/${serviceId}/upgrade/${planCode}/simulate`,
      {
        rootPath: 'apiv6',
        data: {
          duration: price.duration,
          pricingMode: price.pricingMode,
          quantity: price.minimumQuantity,
        },
      },
    );
  }

  /**
   * confirm the upgrade to new Shared CDN (CDNv2)
   * @param {boolean} autoPayWithPreferredPaymentMethod:
   * @param {object} serviceOption: get from serviceOptions
   * @param {number} serviceId: get from serviceOptions
   * @returns {*}: promise
   */
  upgradeToSharedCDN(
    autoPayWithPreferredPaymentMethod,
    serviceOption,
    serviceId,
  ) {
    const price = find(serviceOption.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    return this.OvhHttp.post(
      `/services/${serviceId}/upgrade/${serviceOption.planCode}/execute`,
      {
        rootPath: 'apiv6',
        data: {
          autoPayWithPreferredPaymentMethod,
          duration: price.duration,
          pricingMode: price.pricingMode,
          quantity: price.minimumQuantity,
        },
      },
    );
  }
}
