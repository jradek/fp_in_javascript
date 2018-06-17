const R = require('ramda')
const moment = require('moment')

class Container {
    constructor (x) {
        this.$value = x;
    }

    static of(x) {
        return new Container(x);
    }

    inspect() {
        return `Container (${this.$value})`;
    }
}

function the_mighty_container() {
    const c1 = Container.of(3);
    console.log(c1);

    const c2 = Container.of("hotdogs");
    console.log(c2);
}

// (a -> b) -> Container a -> Container b
Container.prototype.map = function (f) {
    return Container.of( f(this.$value) );
}

function my_first_functor() {
    const c1 = Container.of(2).map( x => x + 2 )
    console.log( c1 ); // Container (4)

    const c2 = Container.of("flamethrowers").map(x => x.toUpperCase());
    console.log(c2); // Container (FLAMETHROWERS)

    const c3 = Container.of('bombs').map(R.concat('away')).map(R.prop('length'));
    console.log(c3); // Container (9)
}

class Maybe {
    static of (x) {
        return new Maybe(x);
    }

    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }

    constructor (x) {
        this.$value = x;
    }

    map(fn) {
        return this.isNothing ? this : Maybe.of( fn( this.$value ) );
    }

    inspect () {
        return this.isNothing ? 'Nothing'
            : `Just (${this.$value})`
    }
}

// func_map :: Functor f => (a -> b) -> f a -> f b
const func_map = R.curry( (f, anyFunctor) => anyFunctor.map( f ));

// maybe :: b -> (a -> b) -> Maybe a -> b
const maybe = R.curry( (value, f, m) => {
    if (m.isNothing) {
        return value;
    }

    return f( m.$value );
});

function schroedingers_maybe() {
    const m1 = Maybe.of("Malkovich").map(R.match(/a/ig));
    console.log(m1); // Just (a)

    const m2 = Maybe.of(null).map(R.match(/a/ig));
    console.log(m2); // Nothing

    const m3 = Maybe.of({name: 'Homer', age: 45}).map(R.prop('age')).map(R.add(10));
    console.log(m3); // Just (55)

    // point free
    const m4 = Maybe.of( 333 );
    console.log( func_map(x => x * 2)( m4 )); // Just (666)
}

function use_cases() {
    // safeHead :: [a] -> Maybe (a)
    const safeHead = xs => Maybe.of( xs[0] );

    console.log(safeHead([1,2,3])); // Just (1)
    console.log(safeHead([])); // Nothing

    // streetName :: Object -> Maybe (String)
    const streetName = R.compose(R.map(R.prop('street')), safeHead, R.prop('addresses'));

    const empty_data = {
        addresses: []
    };
    console.log(streetName(empty_data)); // Nothing

    const data = {
        addresses: [ { street: 'Shady Ln.', number: 4201} ]
    }
    console.log(streetName(data)); // Just (Shady Ln.)

    // withdraw :: Number -> Account -> Maybe (Account)
    const withdraw = R.curry( (amount, { balance }) =>
        Maybe.of( balance >= amount ? { balance: balance - amount } : null )
    );

    // updateLedger :: Account -> Account
    const updateLedger = account => account;

    // remainingBalance :: Account -> String
    const remainingBalance = ({ balance }) => `Your balance is $${balance}`;

    // finishTransaction :: Account -> String
    const finishTransaction = R.compose( remainingBalance, updateLedger );

    // getTwenty :: Account -> Maybe (String)
    const getTwenty = R.compose( func_map(finishTransaction), withdraw(20) );

    console.log(getTwenty( { balance: 200.00 })); // Just (Your balance is $180)
    console.log(getTwenty( { balance: 10 } )); // Nothing
    console.log(getTwenty( { invalid_key: 'foo' } )); // Nothing

    const getTwenty_v2 = R.compose( maybe('You are broke!', finishTransaction ), withdraw(20) );

    console.log(getTwenty_v2( { balance: 30 })); // Your balance is $10
    console.log(getTwenty_v2( { balance: 10 })); // You are broke!
}


class Either {
    static of (x) {
        return new Right(x);
    }

    constructor (x) {
        this.$value = x;
    }
}

class Left extends Either {
    map (f) { return this; }

    inspect () { return `Left (${this.$value})`; }
}

// left :: a -> Either a b
const left = a => new Left(a);

class Right extends Either {
    map (f) { return Either.of( f(this.$value) ); }

    inspect () { return `Right (${this.$value})`; }
}

// either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = R.curry( (f, g, e) => {
    let result;
    switch (e.constructor) {
        case Left:
            result = f(e.$value);
            break;
        case Right:
            result = g(e.$value);
            break;
    }

    return result;
});

function either_tests() {
    const e1 = Either.of('rain').map( str => `b${str}`);
    console.log(e1); // Right (brain)

    const e2 = left( 'rain').map( str => `huhu ${str}`);
    console.log(e2); // Left (rain)

    const e3 = Either.of( {host: 'localhost', port: 80 }).map( R.prop('host'));
    console.log(e3); // Right (localhost)

    const e4 = left('rolls eyes ...').map( R.prop('host'));
    console.log(e4); // Left (rolls eyes ...)

    const e5 = either(R.id, x => x * 2, Either.of(10));
    console.log(e5); // Right (20)

    const e6 = either(R.identity, x => x * 2, left('oops'));
    console.log(e6); // Left (oops)
}

function pure_error_handling() {
    either_tests();

    const getAge = R.curry( (now, user) => {
        const birthDate = moment(user.birthDate, 'YYYY-MM-DD');
        return  birthDate.isValid()
            ? Either.of( now.diff(birthDate, 'years'))
            : left('Birth date could not be parsed');
    });

    console.log( getAge( moment(), { birthDate: '2005-12-12'}) ); // Right (12)

    console.log( getAge( moment(), { birthDate: 'July 4, 2001'}) ); // Left (Birth date could not be parsed)

    // fortune :: Number -> String
    const fortune = R.compose( R.concat('if you survive, you will be '), R.toString, R.add(1));

    const zoltar = R.compose(func_map(console.log), func_map(fortune), getAge(moment()));

    zoltar( {birthDate: '2005-12-12'} ); // if you survive, you will be 13
    zoltar( {birthDate: 'none'} ); // Left (Birth date could not be parsed)

    console.log( R.compose(func_map(fortune), getAge(moment())) ({birthDate: 'none'}) );
}

class IO {
    static of(x) {
        return new IO( () => x );
    }

    constructor (fn) {
        this.$value = fn;
    }

    map (fn) {
        return new IO(R.compose(fn, this.$value));
    }

    inspect () {
        return `IO (${this.$value})`;
    }

    perform() {
        this.$value();
    }
}

function old_mcdonald_had_effects() {
    const myLogger = new IO( () => console.log('logging') );
    console.log(myLogger);

    const logger2 = myLogger.map( () => console.log('more logging'))
    logger2.perform();

    const ioWindow = new IO( () => { innerWidth: 100 } );
    const width = ioWindow.map( win => win.innerWidth );
}


function chapter08() {
    console.log("--- Chapter 08 ---");

    the_mighty_container();
    my_first_functor();
    schroedingers_maybe();
    use_cases();
    pure_error_handling();
    old_mcdonald_had_effects();
}

/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////

chapter08();
