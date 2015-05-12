angular.module('starter.controllers', [])

.controller('ScoreCtrl', function ($scope, ScoreTable) {
    $scope.castorama = new Castorama(ScoreTable);
    $scope.inputClick = function () {
        console.log("me!");
    }
    $scope.genderSelect = function (g) {
        $scope.castorama.gender.toggle = (g == 'men');
    }
})

.controller('StatsCtrl', function ($scope, $http, $ionicPopup, $ionicScrollDelegate) {
    var offset = 0;
    var limit = 20;
    var canLoadMore = true;

    $scope.orderItems = [
      new OrderItem("Datum", 'date'),
      new OrderItem("Namn", 'name'),
      new OrderItem("Förening", 'club'),
      new OrderItem("Poäng", 'score'),
      new OrderItem("Kula", 'shot'),
      new OrderItem("Spjut", 'jav'),
      new OrderItem("Diskus", 'disc'),
      new OrderItem("Slägga", 'ham')
    ];    
    $scope.options = {
        gender: 'all',
        yearStart: 1981,
        yearEnd: 2014,
        direction: new OrderDirection(),
        orderby: $scope.orderItems[0].column
    }
    $scope.search = { name: "", club: "" };
    
    $scope.showOptions = optionsPopup($scope, $ionicPopup);
    $scope.showSearch = searchPopup($scope, $ionicPopup);
    $scope.result = [];
    $scope.addItems = function () {
        console.log('addItems');
        $http.post('http://datormannen.se/index.php/stats/search/', postData(limit, offset)).success(function (data) {
            canLoadMore = (data.length == limit);
            for (var i = 0; i < data.length; ++i)
                $scope.result.push(data[i]);
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
        return search + cohort + " från " + opt.yearStart + " till " + opt.yearEnd;
    }
    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
    };
    $scope.resetResult = function () {
        $scope.result = [];
        canLoadMore = true;
        offset = 0;
    }
    function postData(limit, offset) {
        var d = {
            fromdate: $scope.options.yearStart + "-01-01",
            todate: ($scope.options.yearEnd + 1) + "-01-01",
            gender: $scope.options.gender,
            name: $scope.search.name,
            club: $scope.search.club,
            limit: limit,
            offset: offset,
            orderby: $scope.options.orderby,
            orderbydir: $scope.options.direction.order
        };
        return d;
    }
});

function OrderItem(title, column) {
    return { title: title, column: column }
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
              { text: 'Avbryt' },
              {
                  text: '<b>Spara</b>',
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