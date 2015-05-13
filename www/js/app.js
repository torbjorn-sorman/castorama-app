// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
    
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })
    
    // Each tab has its own nav history stack:
    
    .state('tab.score', {
        url: '/score',
        views: {
            'tab-score': {
                templateUrl: 'templates/tab-score.html',
                controller: 'ScoreCtrl'
            }
        }
    })
    .state('tab.stats', {
        url: '/stats',
        views: {
            'tab-stats': {
                templateUrl: 'templates/tab-stats.html',
                controller: 'StatsCtrl'
            }
        }
    })
    .state('tab.stats-record', {
        url: '/record/:recordId',
        views: {
            'tab-stats': {
                templateUrl: 'templates/record.html',
                controller: 'RecordCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/score');

});

function toMeterString(txt) {
    if (txt == 0)
        return '-----';
    var m = Math.floor(parseInt(txt) / 100);
    var cm = parseInt(txt) - m * 100;
    var d = (0.1).toLocaleString().substring(1, 2);
    var m_str = ((m < 10) ? ' ' : '') + m.toString();
    var cm_str = ((cm < 10) ? '0' : '') + cm.toString();
    return m_str + d + cm_str + 'm';
}
