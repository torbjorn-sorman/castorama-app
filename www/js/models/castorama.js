
function Castorama(scoreTable) {
    var table = scoreTable;
    var gender = new Gender('men');
    var sum = new Sum();
    var events = {
        shot: new Event(table, gender, sum, 'shot', ''),
        javelin: new Event(table, gender, sum, 'javelin', ''),
        discus: new Event(table, gender, sum, 'discus', ''),
        hammer: new Event(table, gender, sum, 'hammer', '')
    };
    gender.sum = sum;
    sum.events = events;

    this.__defineGetter__("events", function () {
        return events;
    });
    this.__defineGetter__("sum", function () {
        return sum;
    });
    this.__defineGetter__("gender", function () {
        return gender;
    });
}

function Sum() {
    var events = null;

    this.__defineGetter__("value", function () {
        var total = 0;
        for (e in events)
            total += parseInt(events[e].score);
        console.log("sum.value: " + total);
        return isNaN(total) || total < 1 ? "" : total;
    });

    this.__defineGetter__("events", function () {
        return events;
    });
    this.__defineSetter__("events", function (val) {
        events = val;
    });
}

function Gender(g) {
    var value = g;
    var sum = null;
    this.__defineGetter__("value", function () {
        return value;
    });
    this.__defineSetter__("value", function (val) {
        if (val == 'men' || val == 'women') {
            value = val;
            sum.value;
        }
    });

    this.__defineGetter__("sum", function () {
        return sum;
    });
    this.__defineSetter__("sum", function (val) {
        sum = val;
    });
}

function Event(t, g, s, e, n) {
    var result = 0;
    var score = 0;

    var table = t;
    var event = e;
    var name = n;
    if (n == '')
        name = 'img/events/' + e + '.png';
    var gender = g;
    var sum = s;

    this.__defineGetter__("result", function () {
        return result < 1 ? "" : result;
    });

    this.__defineSetter__("result", function (val) {
        console.log("event.result: " + val);
        val = parseFloat(val);
        result = val;
        sum.value;
        console.log("event.result(parsed): " + result);
    });

    this.__defineGetter__("score", function () {
        score = table.lookup(gender.value, event, result * 100);
        return score < 1 ? "" : score;
    });

    this.__defineGetter__("name", function () {
        return name;
    });
}