angular.module('starter.services', [])

.factory('RecordTracker', function () {
    var records = [];
    var fetchRecord = function ($http, id, callback) {
        $http.get('http://datormannen.se/index.php/stats/get/' + id).success(function (data) {
            records[id] = data[0];
            callback(data[0]);
            console.log(data[0]);
        });
    }
    return {
        set: function (record) {
            records[record.id] = record;
        },
        get: function (id) {
            if (!(id in records)) {
                fetchRecord(arguments[1], id, arguments[2]);
                return null;
            }
            return records[id];
        }
    };
})

.factory('ScoreTable', function ($http) {
    var source = 'js/data/score_table/';
    var score_table = {
        men: {
            discus: null,
            hammer: null,
            javelin: null,
            shot: null
        },
        women: {
            discus: null,
            hammer: null,
            javelin: null,
            shot: null
        }
    };
    // Men
    $http.get(source + 'men/shot.json').success(function (data, status, headers, config) {
        score_table.men.shot = data;
    });
    $http.get(source + 'men/javelin.json').success(function (data) {
        score_table.men.javelin = data;
    });
    $http.get(source + 'men/discus.json').success(function (data) {
        score_table.men.discus = data;
    });
    $http.get(source + 'men/hammer.json').success(function (data) {
        score_table.men.hammer = data;
    });
    // Women
    $http.get(source + 'women/shot.json').success(function (data) {
        score_table.women.shot = data;
    });
    $http.get(source + 'women/javelin.json').success(function (data) {
        score_table.women.javelin = data;
    });
    $http.get(source + 'women/discus.json').success(function (data) {
        score_table.women.discus = data;
    });
    $http.get(source + 'women/hammer.json').success(function (data) {
        score_table.women.hammer = data;
    });

    return {
        lookup: function (gender, event, result) {
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
});
