const ramda = require('ramda')

var add = function(x) {
    return function(y) {
      return x + y;
    };
  };


var match = ramda.curry(function(what, str) {
    return str.match(what);
});

var replace = ramda.curry(function(what, replacement, str) {
    return str.replace(what, replacement);
});

var filter = ramda.curry(function(f, ary) {
    return ary.filter(f);
});

var map = ramda.curry(function(f, ary) {
    return ary.map(f);
});


var hasSpaces = match(/\s+/g);
var findSpaces = filter(hasSpaces);

var myAdd = ramda.curry(function(x, y, z) {
    return x + y + z;
});


function chapter04() {
    console.log("--- Chapter 04 ---");

    var increment = add(1);
    var addTen = add(10);

    console.log(increment(2));
    console.log(addTen(2));

    console.log(match(/\s+/g, "hello world"));
    console.log(findSpaces(["tori_spelling", "tori amos"]))

    console.log(myAdd(10)(20)(30));
}

/////////////////////////////////////////////////////////////////////

function exercise1() {
    // Use map to make a new words fn that works on an array of strings.
    var words = str => ramda.split(' ', str);

    var sentences = map(words)

    console.log(words("hallo michael"));
    console.log(sentences(["hallo michael", "welt"]))
}

function exercise2() {
    // Refactor to remove all arguments by partially applying the functions
    var filterQs = xs => {
        return ramda.filter(function(x){ return match(/q/i, x);  }, xs);
    };

    var filterQs_v2 = xs => ramda.filter(match(/q/i), xs);
    var filterQs_v3 = ramda.filter(match(/q/i));

    var qs = ["q", "michael", "die q", "jaqueline"];

    console.log(filterQs(qs));
    console.log(filterQs_v2(qs));
    console.log(filterQs_v3(qs));
}

function exercise3() {
    // Use the helper function _keepHighest to refactor max to not reference any arguments

    // LEAVE BE:
    //var _keepHighest = function(x,y){ return x >= y ? x : y; };
    var _keepHighest = (x,y) => x >= y ? x : y;

    // REFACTOR THIS ONE:
    var max = function(xs) {
        return ramda.reduce(function(acc, x){
            return _keepHighest(acc, x);
        }, -Infinity, xs);
    };

    var max_v2 = ramda.reduce(function(acc, x){
            return _keepHighest(acc, x);
        }, -Infinity);

    var max_v3 = ramda.reduce(_keepHighest, -Infinity);

    var max_v4 = ramda.reduce(Math.max, -Infinity);

    var values = [2, 6, 4, 3];

    console.log(max(values));
    console.log(max_v2(values));
    console.log(max_v3(values));
    console.log(max_v4(values));
}


function exercises() {
    console.log('--- Exercises 04 ---');
    exercise1();
    exercise2();
    exercise3();
}

/////////////////////////////////////////////////////////////////////

chapter04();
exercises();
