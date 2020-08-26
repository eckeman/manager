import find from 'lodash/find';

angular
  .module('managerApp')
  .controller('TelecomTelephonyLineCtrl', function TelecomTelephonyLineCtrl(
    $q,
    $stateParams,
    $translate,
    TelephonyMediator,
    TucToast,
  ) {
    const self = this;

    self.loading = {
      init: false,
      save: false,
    };

    self.line = null;
    self.fax = null;
    self.links = null;

    /*= ==============================
    =            ACTIONS            =
    =============================== */

    self.lineNameSave = function lineNameSave(newServiceDescription) {
      self.line.startEdition();
      self.line.description = newServiceDescription;
      return self.line.save().then(
        () => {
          self.line.stopEdition();
        },
        (error) => {
          self.line.stopEdition(true);
          TucToast.error(
            [
              $translate.instant('telephony_line_rename_error', $stateParams),
              error.data.message,
            ].join(' '),
          );
          return $q.reject(error);
        },
      );
    };

    /* -----  End of ACTIONS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

    function init() {
      self.loading.init = true;

      return TelephonyMediator.getGroup($stateParams.billingAccount)
        .then((group) => {
          const promises = [];
          self.line = group.getLine($stateParams.serviceName);
          self.fax = find(group.fax, { serviceName: $stateParams.serviceName });

          // check if line is terminating
          promises.push(
            self.line.getTerminating().then((terminating) => {
              self.terminating = terminating;
            }),
          );

          // check if line is converting to alias
          promises.push(
            self.line.getConvertionTask().then((task) => {
              self.converting = task;
            }),
          );

          self.links = {
            contactDetails: TelephonyMediator.getV6ToV4RedirectionUrl(
              'line.line_manage_directory',
            ),
          };

          return $q.all(promises);
        })
        .finally(() => {
          self.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------*/

    init();
  });
