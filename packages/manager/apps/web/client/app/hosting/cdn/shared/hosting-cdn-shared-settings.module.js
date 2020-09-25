import routing from './hosting-cdn-shared-settings.routing';
import service from './hosting-cdn-shared-settings.service';
import component from './hosting-cdn-shared-settings.component';

const moduleName = 'ovhManagerHostingCdnShared';

angular
  .module(moduleName, [])
  .component('hostingCdnSharedSettings', component)
  .service('HostingCdnSharedService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
