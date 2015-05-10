angular.module('starter.filters', [])

.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<=max; ++i)
      input.push(i);
    return input;
  };
})

.filter('upperLimit',[function()
{
  return function(array,limit) {        
    return array.filter(function(item){
      return parseInt(item) <= parseInt(limit);
    });
  };
}])

.filter('lowerLimit',[function()
{
  return function(array,limit) {
    return array.filter(function(item){
      return parseInt(item) >= parseInt(limit);
    });
  };
}]);