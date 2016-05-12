(function() {
  'use strict';

  angular.module('decWrapper', []);

})();

(function() {
  'use strict';

  angular.module('decWrapper')
         .provider('connectionManager', ConnectionManager);

  /** @ngInject */
  function ConnectionManager($windowProvider) {
    var $window = $windowProvider.$get();

    var decInitMethod = $window.init;


    this.$get = get;

    /** @ngInject */
    function get($window, $q) {
      var deferred = $q.defer();
      var connectionStatus = {
        isOnline: false
      };

      function initCallback(initResponse) {
        connectionStatus.initResponse = initResponse;

        if (initResponse.successCode === '0') {
          connectionStatus.isOnline = true;
          deferred.resolve(connectionStatus);
        }
        else {
          connectionStatus.isOnline = false;
          deferred.reject(connectionStatus);
        }
      }

      function initialize(appName, subscriptions) {
        if (decInitMethod) {
          try {
            decInitMethod(initCallback, subscriptions, appName);
          }
          catch (e) {
            deferred.reject(e);
          }
        }
        else {
          throw 'DEC initialization method not set';
        }
        return deferred.promise;
      }

      return {
        initialize: initialize,
        get status() {
          return connectionStatus;
        }
      };
    }
    get.$inject = ["$window", "$q"];
  }
  ConnectionManager.$inject = ["$windowProvider"];
})();

(function() {
  'use strict';

  angular.module('decWrapper')
         .factory('decFactory', DecFactory);

  /** @ngInject */
  function DecFactory(connectionManager, driveInstanceManager) {
    return {
      connection: connectionManager,
      drive: driveInstanceManager
    };
  }
  DecFactory.$inject = ["connectionManager", "driveInstanceManager"];
})();

(function() {
  'use strict';

  angular
    .module('decWrapper')
    .provider('driveInstanceManager', DriveInstanceManager);


  /** @ngInject */
  function DriveInstanceManager($windowProvider) {
    var $window = $windowProvider.$get();
    var driveInstance = $window.drive;

    this.$get = function() {
      return driveInstance;
    };
  }
  DriveInstanceManager.$inject = ["$windowProvider"];
})();
