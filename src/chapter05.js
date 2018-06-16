// imports
const R = require('ramda')


// let's go
const compose2 = (f, g) => x => f(g(x));

const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;
const shout = compose2(exclaim, toUpperCase);
const shout_long = x => exclaim(toUpperCase(x));

// utils
// reduce :: (b -> a -> b) -> b -> [a] -> b
const reduce = R.curry((fn, zero, xs) => xs.reduce(fn, zero));

const head = x => x[0];
const reverse = reduce((acc, x) => [x].concat(acc), []);
const last = compose2(head, reverse);

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

const snakeCase_pointFree = compose2(replace(/\s+/ig, '_'), toLowerCase);

const initials = name => name.split(' ').map(compose2(toUpperCase, head)).join('. ');

// join :: Monad m => m (m a) -> m a
const join = R.curry((sep, xs) => xs.join(sep));

// map :: Functor f => (a -> b) -> f a -> f b
const map = R.curry((fn, xs) => xs.map(fn));

// split :: String -> String -> [String]
const split = R.curry((sep, str) => str.split(sep));

const initials_pointFree = R.compose(join('. '), map(compose2(toUpperCase, head)), split(' '));


function point_free() {
    console.log(snakeCase('hi michael'));
    console.log(snakeCase_pointFree('hi michael point free'));

    name = 'hunter stockton thompson';
    console.log(initials(name));
    console.log(initials_pointFree(name));
}


function chapter05() {
    console.log("--- Chapter 05 ---");
    functional_husbandry();
    point_free();
}

/////////////////////////////////////////////////////////////////

cars = [
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 185000,
        in_stock: true
    },
    {
        name: 'Skoda Octavia',
        horsepower: 120,
        dollar_value: 666,
        in_stock: false
    }
]

const prop = R.curry((field, obj) => obj[field]);


function exercise1() {
    // console.log(cars);

    // Use `compose()` to rewrite the function below. 

    // isLastInStock :: [Car] -> Boolean
    const isLastInStock = (cars) => {
        const lastCar = last(cars);
        return prop('in_stock', lastCar);
    }

    const isLastInStock_v1 = R.compose(prop('in_stock'), last);

    console.log(isLastInStock(cars));
    console.log(isLastInStock_v1(cars));

    // console.log(prop('in_stock', cars[0]));
}

function exercise2() {
    const add = R.curry((x, y) => x + y);
    const average = xs => reduce(add, 0, xs) / xs.length;

    // console.log(average([1,2,3]));

    // Use the helper function `average` to refactor `averageDollarValue` as a composition. 

    // averageDollarValue :: [Car] -> Int
    const averageDollarValue = (cars) => {
        const dollarValues = map(c => c.dollar_value, cars);
        return average(dollarValues);
    };

    const averageDollarValue_v1 = compose2(average, map(prop('dollar_value')));

    console.log(averageDollarValue(cars));
    console.log(averageDollarValue_v1(cars));
}



function exercise3() {
    // Refactor `fastestCar` using `compose()` and other functions in pointfree-style. Hint, the `flip` function may come in handy.

    const flip = R.curry((fn, a, b ) => fn(b, a));

    // fastestCar :: [Car] -> String
    const fastestCar = (cars) => {
        const sorted = R.sortBy(car => car.horsepower, cars);
        const fastest = last(sorted);
        return R.concat(fastest.name, ' is the fastest');
    }

    const fastestCar_v1 = R.compose(
        flip(R.concat, ' is the fastest'),
        prop('name'),
        last, R.sortBy(prop('horsepower')));

    console.log(fastestCar(cars));
    console.log(fastestCar_v1(cars));
}

function exercises() {
    console.log('--- Exercises 05 ---');
    exercise1();
    exercise2();
    exercise3();
}

/////////////////////////////////////////////////////////////////////

chapter05();
exercises();
