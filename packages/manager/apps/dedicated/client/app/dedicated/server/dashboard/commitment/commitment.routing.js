export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.commitment', {
    url: '/commitment?duration',
    component: 'billingCommitment',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      duration: /* @ngInject */ ($transition$) =>
        $transition$.params().duration,
    },
  });
};
