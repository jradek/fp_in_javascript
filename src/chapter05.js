// imports
const R = require('ramda')


// let's go
const compose = (f, g) => x => f(g(x));

const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;
const shout = compose(exclaim, toUpperCase);
const shout_long = x => exclaim(toUpperCase(x));

// utils
// reduce :: (b -> a -> b) -> b -> [a] -> b
const reduce = R.curry((fn, zero, xs) => xs.reduce(fn, zero));

const head = x => x[0];
const reverse = reduce((acc, x) => [x].concat(acc), []);
const last = compose(head, reverse);

const lastUpper = R.compose(toUpperCase, head, reverse);
const loudLastUpper = R.compose(exclaim, toUpperCase, head, reverse);

function functional_husbandry() {

    console.log(toUpperCase("Michael"));
    console.log(exclaim("Michael"));
    console.log(shout("michael"));

    const xs = ['jumpkick', 'roundhouse', 'uppercut']
    console.log(last(xs));

    // console.log([1,2,3].reduce((x,y) => x + y, 0));

    console.log(lastUpper(xs));
    console.log(loudLastUpper(xs));
}

// utils
// replace :: RegExp -> String -> String -> String
const replace = R.curry((re, rpl, str) => str.replace(re, rpl));

// toLowerCase :: String -> String
const toLowerCase = s => s.toLowerCase();


// not point free
const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_')

const snakeCase_pointFree = compose(replace(/\s+/ig, '_'), toLowerCase);

const initials = name => name.split(' ').map(compose(toUpperCase, head)).join('. ');

// join :: Monad m => m (m a) -> m a
const join = R.curry((sep, xs) => xs.join(sep));

// map :: Functor f => (a -> b) -> f a -> f b
const map = R.curry((fn, xs) => xs.map(fn));

// split :: String -> String -> [String]
const split = R.curry((sep, str) => str.split(sep));


const initials_pointFree = compose(join('. '), map(x => x.toUpperCase()), split(' '));


function point_free() {
    console.log(snakeCase('hi michael'));
    console.log(snakeCase_pointFree('hi michael point free'));

    name = 'hunter stockton thompson';
    console.log(initials(name));
    // console.log(initials_pointFree(name));
    // console.log(map(x => x.toUpperCase())('hallo'));
}


function chapter05() {
    console.log("Chapter05");
    // functional_husbandry();
    point_free();
}

chapter05();
