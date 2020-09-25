import assign from 'lodash/assign';

export default /* @ngInject */ ($stateProvider) => {
  const resolve = {
    goBack: /* @ngInject */ ($state) => () => $state.go('^'),

    rules: /* @ngInject */ ($transition$) => $transition$.params().rules,

    priority: /* @ngInject */ ($transition$) => $transition$.params().priority,

    callbacks: /* @ngInject */ ($transition$) =>
      $transition$.params().callbacks,
  };
  const rEdit = {
    rule: /* @ngInject */ ($transition$) => $transition$.params().rule,
  };
  const params = {
    rules: null,
    priority: null,
    callbacks: null,
  };
  const pEdit = {
    rule: null,
  };

  $stateProvider.state('app.hosting.cdn.shared.addCacheRule', {
    url: '/add-cache-rule',
    views: {
      modal: {
        component: 'hostingSharedSettingsAddCacheRule',
      },
    },
    params,
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve,
  });

  $stateProvider.state('app.hosting.cdn.shared.editCacheRule', {
    url: '/edit-cache-rule',
    views: {
      modal: {
        component: 'hostingSharedSettingsAddCacheRule',
      },
    },
    params: assign({}, params, pEdit),
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: assign({}, resolve, rEdit),
  });
};
