String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

angular.module('starter.controllers', [])

.controller('RecordCtrl', function ($scope, $stateParams, $ionicLoading, $http, ScoreTable, RecordTracker) {
    var selectedRecord = null;
    $scope.castorama = new Castorama(ScoreTable);
    var updateRecord = function (record) {
        $scope.record = record;
        $scope.castorama.setFromRecord(record);
        $ionicLoading.hide();
    }
    selectedRecord = RecordTracker.get($stateParams.recordId, $http, updateRecord);
    if (selectedRecord == null) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        console.log('wait...');        
    } else {
        updateRecord(selectedRecord);
    }
    $scope.toMeterString = toMeterString;
})

.controller('ScoreCtrl', function ($scope, ScoreTable) {
    $scope.castorama = new Castorama(ScoreTable);
    $scope.genderSelect = function (g) {
        $scope.castorama.gender.toggle = (g == 'men');
    }
})

.controller('StatsCtrl', function ($scope, $http, $ionicPopup, $ionicScrollDelegate, RecordTracker)
{
    // Variables
    var offset = 0;
    var limit = 20;
    var canLoadMore = true;
    var orderingItems = [
      new OrderItem("Datum", 'date'),
      new OrderItem("Namn", 'name'),
      new OrderItem("Förening", 'club'),
      new OrderItem("Poäng", 'score'),
      new OrderItem("Kula", 'shot', 'shot'),
      new OrderItem("Spjut", 'javelin', 'javelin'),
      new OrderItem("Diskus", 'discus', 'discus'),
      new OrderItem("Slägga", 'hammer', 'hammer')
    ];
    var options = {
        gender: 'all',
        yearStart: 1981,
        yearEnd: 2014,
        direction: new OrderDirection(),
        orderby: orderingItems[0]
    };
    var search = { name: "", club: "", location: "" };

    // "Public"
    $scope.orderItems = orderingItems;
    $scope.nonEventItems = orderingItems.slice(0, 4);
    $scope.eventItems = orderingItems.slice(4, orderingItems.length);
    $scope.options = options;
    $scope.search = search;
    $scope.result = [];
    $scope.showOptions = optionsPopup($scope, $ionicPopup);
    $scope.showSearch = searchPopup($scope, $ionicPopup);
    $scope.addItems = function () {
        $http.post('http://datormannen.se/index.php/stats/search/', postData(limit, offset)).success(function (data) {
            canLoadMore = (data.length == limit);
            for (var i = 0; i < data.length; ++i) {
                $scope.result.push(data[i]);
                RecordTracker.set(data[i]);
            }
            offset += data.length;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.$on('$stateChangeSuccess', function () {
        $scope.addItems();
    });
    $scope.moreItemsCanBeLoaded = function () {
        return canLoadMore;
    }
    $scope.displayOptions = function (opt) {
        var search = "";
        if ($scope.search.name != "")
            search += "'" + $scope.search.name + "' ";
        if ($scope.search.club != "")
            search += "'" + $scope.search.club + "' ";
        if (search.length > 0)
            search += "bland "
        var cohort = "alla";
        if (opt.gender != 'all')
            cohort = (opt.gender == 'men') ? "män" : "kvinnor";
        return (search + cohort + " från " + opt.yearStart + " till " + opt.yearEnd).capitalizeFirstLetter();
    }
    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
    };
    $scope.resetResult = function () {
        $scope.result = [];
        canLoadMore = true;
        offset = 0;
    }
    $scope.eventSummary = function (eventItem) {
        if (eventItem.shot == 0 && eventItem.jav == 0 && eventItem.disc == 0 && eventItem.ham == 0)
            return '';
        return toMeterString(eventItem.shot) + " | " + toMeterString(eventItem.jav) + " | " + toMeterString(eventItem.disc) + " | " + toMeterString(eventItem.ham);
    }
    $scope.sortingIndex = function (options, item) {
        if (options.orderby.isMeter)
            for (p in item)
                if (p == options.orderby.column)
                    return toMeterString(item[p]);
        return item.score;
    }
    // Private functions    
    function postData(limit, offset) {
        var d = {
            fromdate: $scope.options.yearStart + "-01-01",
            todate: ($scope.options.yearEnd + 1) + "-01-01",
            gender: $scope.options.gender,
            name: $scope.search.name,
            club: $scope.search.club,
            location: $scope.search.location,
            limit: limit,
            offset: offset,
            orderby: $scope.options.orderby.column,
            orderbydir: $scope.options.direction.order
        };
        return d;
    }
});

function OrderItem(title, column) {
    if (arguments.length > 2)
        return { title: title, column: column, name: arguments[2], isMeter: true };
    return { title: title, column: column, isMeter: false };
}

function OrderDirection() {
    var value = false;
    this.__defineGetter__("value", function () {
        return value;
    });
    this.__defineSetter__("value", function (val) {
        value = val;
    });
    this.__defineGetter__("disp", function () {
        return value ? 'Stigande' : 'Fallande';
    });
    this.__defineGetter__("order", function () {
        return value ? 'asc' : 'desc';
    });
}

function optionsPopup($scope, $ionicPopup) {
    var $scope = $scope;
    var $ionicPopup = $ionicPopup;
    return function () {
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/tab-stats-options.html',
            title: 'Sökfilter',
            scope: $scope,
            buttons: [
                {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function () {
                        $scope.resetResult();
                        $scope.addItems();
                    }
                }
            ]
        });
    }
}

function searchPopup($scope, $ionicPopup) {
    var $scope = $scope;
    var $ionicPopup = $ionicPopup;
    return function () {
        var myPopup = $ionicPopup.show({
            templateUrl: 'templates/tab-stats-search.html',
            title: 'Fritextsökning',
            scope: $scope,
            buttons: [
              { text: 'Avbryt' },
              {
                  text: '<b>Sök</b>',
                  type: 'button-positive',
                  onTap: function () {
                      $scope.resetResult();
                      $scope.addItems();
                  }
              }
            ]
        });
    }
}