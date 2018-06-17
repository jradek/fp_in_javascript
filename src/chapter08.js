const R = require('ramda')

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
}


function chapter08() {
    console.log("--- Chapter 08 ---");

    the_mighty_container();
    my_first_functor();
    schroedingers_maybe();
    use_cases();
}

/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////

chapter08();
