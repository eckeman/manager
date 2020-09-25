import routing from './hosting-cdn.routing';

import shared from './shared/hosting-cdn-shared-settings.module';
import sharedAddCacheRule from './shared/add-edit-cache-rule/hosting-shared-add-edit-cache-rule.module';
import sharedConfirmSettings from './shared/leave-confirm-settings/confirm/hosting-shared-confirm-settings.module';
import flush from './flush/hosting-cdn-flush.module';
import order from './order/hosting-cdn-order.module';
import terminate from './terminate/hosting-cdn-terminate.module';

const moduleName = 'ovhManagerHostingCdn';

angular
  .module(moduleName, [
    flush,
    order,
    terminate,
    shared,
    sharedAddCacheRule,
    sharedConfirmSettings,
  ])
  .config(routing);

export default moduleName;
