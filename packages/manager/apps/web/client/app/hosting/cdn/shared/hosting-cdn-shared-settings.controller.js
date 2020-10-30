import set from 'lodash/set';
import get from 'lodash/get';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import assign from 'lodash/assign';
import filter from 'lodash/filter';
import maxBy from 'lodash/maxBy';
import concat from 'lodash/concat';
import map from 'lodash/map';
import clone from 'lodash/clone';
import includes from 'lodash/includes';

import {
  SHARED_CDN_SETTINGS_RULE_CACHE_RULE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
  SHARED_CDN_SETTINGS_RULE_TYPE_BROTLI,
  SHARED_CDN_SETTINGS_RULE_TYPE_DEVMODE,
} from './hosting-cdn-shared-settings.constants';

export default class CdnSharedSettingsController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    $uibModal,
    Alerter,
    HostingCdnSharedService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.HostingCdnSharedService = HostingCdnSharedService;
  }

  $onInit() {
    this.model = {
      alwaysOnline: {
        enabled: true,
        changed: false,
      },
      http: {
        enabled: true,
        changed: false,
      },
      devmode: null,
      brotli: null,
      rules: [],
    };
    this.tasks = {
      toAdd: [],
      toUpdate: [],
      toRemove: [],
    };
    this.HostingCdnSharedService.model = this.model;
    this.HostingCdnSharedService.tasks = this.tasks;

    this.model.rules = filter(this.domainOptions, {
      type: SHARED_CDN_SETTINGS_RULE_CACHE_RULE,
    });
    this.model.devmode = assign(
      find(this.domainOptions, {
        type: SHARED_CDN_SETTINGS_RULE_TYPE_DEVMODE,
      }),
      { changed: false },
    );
    this.model.brotli = assign(
      find(this.domainOptions, { type: SHARED_CDN_SETTINGS_RULE_TYPE_BROTLI }),
      { changed: false },
    );
    this.model.rulesName = map(this.model.rules, (r) => r.name);
  }

  getSwitchBtnStatusText(switchBtn) {
    return this.$translate.instant(
      `hosting_cdn_shared_state_${switchBtn ? 'enable' : 'disabled'}`,
    );
  }

  convertToUnitTime(ttl) {
    if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_DAY === 0) {
      return `${ttl /
        SHARED_CDN_SETTINGS_RULE_FACTOR_DAY} ${this.$translate.instant(
        'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_days',
      )}`;
    }
    if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR === 0) {
      return `${ttl /
        SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR} ${this.$translate.instant(
        'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_hours',
      )}`;
    }
    return `${ttl /
      SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE} ${this.$translate.instant(
      'hosting_cdn_shared_modal_add_rule_field_time_to_live_unit_minutes',
    )}`;
  }

  getMaxPriority() {
    return (
      get(maxBy(this.model.rules, 'config.priority'), 'config.priority') || 0
    );
  }

  rulePriorityExist(rule) {
    return find(
      this.model.rules,
      (r) => rule !== r && r.config.priority === rule.config.priority,
    );
  }

  setRulesPriority(rule) {
    if (this.rulePriorityExist(rule)) {
      forEach(this.model.rules, (iRule) => {
        const { priority } = iRule.config;
        if (rule !== iRule && priority >= rule.config.priority) {
          set(iRule, 'config.priority', priority + 1);
        }
      });
    }
  }

  markRuleAsToCreate(rule) {
    this.tasks.toAdd.push(rule);
  }

  markRuleAsToUpdate(rule) {
    const i = this.tasks.toUpdate.indexOf(rule);
    if (i < 0 && rule !== find(this.tasks.toAdd, (r) => r === rule))
      this.tasks.toUpdate.push(rule);
  }

  markRuleAsToRemove(rule) {
    this.tasks.toRemove.push(rule);
  }

  openCreatCacheRuleModal() {
    const priority = {
      max: this.getMaxPriority() + 1,
      value: this.getMaxPriority() + 1,
    };
    const callbacks = {
      success: (rule) => {
        this.setRulesPriority(rule);
        this.markRuleAsToCreate(rule);
        this.model.rules.push(rule);
      },
      fail: (err) => {
        this.Alerter.error(err.message);
      },
      cancel: () => {},
    };
    const params = {
      rule: null,
      rules: this.model.rules,
      priority,
      callbacks,
    };
    this.displayCreateCacheRuleModal(params);
  }

  openUpdateCacheRuleModal(rule) {
    const priority = {
      value: rule.config.priority,
    };
    const callbacks = {
      success: (uRule) => {
        this.setRulesPriority(uRule);
        this.markRuleAsToUpdate(uRule);
      },
      fail: () => {},
      cancel: () => {},
    };
    const params = {
      rule,
      rules: this.model.rules,
      priority,
      callbacks,
    };
    this.displayUpdateCacheRuleModal(params);
  }

  removeCacheRule(rule) {
    const isSavedRule = includes(this.model.rulesName, rule.name);
    if (isSavedRule) this.markRuleAsToRemove(rule);

    let index = this.tasks.toAdd.indexOf(rule);
    if (index >= 0) this.tasks.toAdd.splice(index, 1);

    index = this.tasks.toUpdate.indexOf(rule);
    if (index >= 0) this.tasks.toUpdate.splice(index, 1);

    index = this.model.rules.indexOf(rule);
    if (index >= 0) this.model.rules.splice(index, 1);
  }

  getSentSwitchesOption() {
    const tasks = [];

    if (this.model.devmode.changed)
      tasks.push(
        this.HostingCdnSharedService.updateCDNDomainOption(
          this.serviceName,
          this.domainName,
          SHARED_CDN_SETTINGS_RULE_TYPE_DEVMODE,
          {
            type: SHARED_CDN_SETTINGS_RULE_TYPE_DEVMODE,
            enabled: this.model.devmode.enabled,
          },
        ),
      );

    if (this.model.brotli.changed)
      tasks.push(
        this.HostingCdnSharedService.updateCDNDomainOption(
          this.serviceName,
          this.domainName,
          SHARED_CDN_SETTINGS_RULE_TYPE_BROTLI,
          {
            type: SHARED_CDN_SETTINGS_RULE_TYPE_BROTLI,
            enabled: this.model.brotli.enabled,
          },
        ),
      );

    return tasks;
  }

  getSentRulesToAdd() {
    if (this.tasks.toAdd.length) {
      return map(this.tasks.toAdd, (rule) => {
        return this.HostingCdnSharedService.addNewOptionToDomain(
          this.serviceName,
          this.domainName,
          rule,
        );
      });
    }

    return [];
  }

  getSentRulesToUpdate() {
    if (this.tasks.toUpdate.length) {
      return map(this.tasks.toUpdate, (rule) => {
        const cRule = clone(rule, true);
        delete cRule.name;
        return this.HostingCdnSharedService.updateCDNDomainOption(
          this.serviceName,
          this.domainName,
          rule.name,
          cRule,
        );
      });
    }

    return [];
  }

  getSentRulesToRemove() {
    if (this.tasks.toRemove.length) {
      return map(this.tasks.toRemove, (rule) => {
        return this.HostingCdnSharedService.deleteCDNDomainOption(
          this.serviceName,
          this.domainName,
          rule.name,
        );
      });
    }

    return [];
  }

  static getChangedSwitches(model) {
    const { alwaysOnline, http, devmode, brotli } = model;
    const switchesTasks = [alwaysOnline, http, devmode, brotli];
    return filter(switchesTasks, (s) => s && s.changed);
  }

  static getChangedRules(tasks) {
    const { toAdd, toUpdate, toRemove } = tasks;
    return concat(toAdd, toRemove, toUpdate);
  }

  openConfirmModal() {
    const switches = this.constructor.getChangedSwitches(this.model);
    const rules = this.constructor.getChangedRules(this.tasks);
    if (switches.length || rules.length) {
      this.displayConfirmSettingsModal({
        rules,
        model: this.model,
        success: () => this.saveSettings(),
        cancel: () => {},
      });
    }
  }

  saveSettings() {
    const tasks = [
      ...this.getSentSwitchesOption(),
      ...this.getSentRulesToRemove(),
      ...this.getSentRulesToUpdate(),
      ...this.getSentRulesToAdd(),
    ];
    this.$q
      .all(tasks)
      .then(() => {
        this.tasks.toAdd = [];
        this.tasks.toUpdate = [];
        this.tasks.toRemove = [];
        this.model.devmode.changed = false;
        this.model.brotli.changed = false;

        this.Alerter.success(
          this.$translate.instant('hosting_cdn_shared_banner_success'),
          'cdnSharedSettings',
        );
      })
      .catch((err) => {
        this.Alerter.error(err.message, 'cdnSharedSettings');
      });
  }
}
