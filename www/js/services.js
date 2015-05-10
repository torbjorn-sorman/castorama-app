angular.module('starter.services', [])

.factory('ScoreTable', function($http) {  
  var source='/js/data/score_table/';
  var score_table = {
    men: {
      discus: null, 
      hammer: null, 
      javelin: null, 
      shot: null},
    women: {
      discus: null, 
      hammer: null, 
      javelin: null, 
      shot: null}
  };
  // Men
  $http.get(source + 'men/shot.json').success(function(data) {
    score_table.men.shot = data;
  });
  $http.get(source + 'men/javelin.json').success(function(data) {
    score_table.men.javelin = data;
  });
  $http.get(source + 'men/discus.json').success(function(data) {
    score_table.men.discus = data;
  });
  $http.get(source + 'men/hammer.json').success(function(data) {
    score_table.men.hammer = data;
  });
  // Women
  $http.get(source + 'women/shot.json').success(function(data) {
    score_table.women.shot = data;
  });
  $http.get(source + 'women/javelin.json').success(function(data) {
    score_table.women.javelin = data;
  });
  $http.get(source + 'women/discus.json').success(function(data) {
    score_table.women.discus = data;
  });
  $http.get(source + 'women/hammer.json').success(function(data) {
    score_table.women.hammer = data;
  });
  
  return {    
    lookup: function(gender, event, result) {
      if (score_table[gender][event] == null)
        return 0;
      var length = score_table[gender][event].length;
      for (var i = 0; i < length; ++i) {
        // Iterate from highest to lowest, equal or higher is the correct score.
        // Tested to increase performance by guessing an initial start position, iteration was shorter but data set to small and siginificant overhead caused slower performance;
        var row = score_table[gender][event][i];
        if (result >= row.result) {
          return row.score;
        }
      }
      return 0;
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
