angular.module('starter.controllers', [])

.controller('ScoreCtrl', function($scope, ScoreTable) {   
  $scope.castorama = new Castorama(ScoreTable);
})

.controller('StatsCtrl', function($scope, $http, $ionicPopup, $ionicScrollDelegate) {
  var offset = 0;
  var limit = 20;
  var canLoadMore = true;  
  $scope.options = {
    gender: 'all',
    yearStart: 1981,
    yearEnd: 2014
  }
  $scope.search = {
    name: "",
    club: ""
  }
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
  $scope.orderByItem = $scope.orderItems[0];
  
  $scope.orderBy = function(item) {
    if ($scope.orderByItem !== item) {
      $scope.orderByItem.deselected();
      $scope.orderByItem = item;
    }
    if (!item.selected()) {
      $scope.orderByItem.deselected();
      $scope.orderByItem = $scope.orderItems[0];
    }
    resetResult();
    $scope.addItems();
  }
  $scope.showOptions = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/tab-stats-options.html',
      title: 'Sökfilter',      
      scope: $scope,
      buttons: [
        { text: 'Avbryt' },
        {
          text: '<b>Spara</b>',
          type: 'button-positive',
          onTap: function() {
            resetResult();
            $scope.addItems();
          }
        }
      ]
    });
  };
  $scope.showSearch = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/tab-stats-search.html',
      title: 'Fritextsökning',      
      scope: $scope,
      buttons: [
        { text: 'Avbryt' },
        {
          text: '<b>Sök</b>',
          type: 'button-positive',
          onTap: function() {
            resetResult();
            $scope.addItems();
          }
        }
      ]
    });
  };
  $scope.result = [];
  $scope.addItems = function() {
    $http.post('http://datormannen.se/index.php/stats/search/', postData(limit, offset)).success(function(data) {      
      canLoadMore = (data.length == limit);
      for (var i = 0; i < data.length; ++i)
        $scope.result.push(data[i]);
      offset += data.length;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }  
  $scope.$on('$stateChangeSuccess', function() {
    $scope.addItems();
  });
  $scope.moreItemsCanBeLoaded = function() {
    return canLoadMore;
  }
  $scope.displayOptions = function(opt) {
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
  $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
  $scope.toStringIfValue = function(index, val) {
    if (index < 3)
      return val;
    if (index == 3)
      return val.toLocaleString()
    if (val == 0)
      return "";
    return (val / 100).toFixed(2);
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
      orderby: $scope.orderByItem.col,
      orderbydir: $scope.orderByItem.direction()
    };
    return d;
  }
  function resetResult() {
    $scope.result = [];
    canLoadMore = true;
    offset = 0;
  }
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

function OrderItem(title, col) {
  return {
    title: title,
    dir: 0,
    append: "",
    active: false,
    col: col,
    direction: function() {      
      if (this.dir == 2)
        return "asc";
      return "desc";
    },
    selected: function() {
      this.dir = ++this.dir % 3;
      this.active = this.dir != 0;
      this.append = ((this.dir == 0) ? "" : ((this.dir == 1) ? "⇩" : "⇧")); // up arrow : down arrow
      return this.active;
    },
    deselected: function() {
      this.dir = 0;
      this.active = false;
      this.append = "";
    }
  }
}