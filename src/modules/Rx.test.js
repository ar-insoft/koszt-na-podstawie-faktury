//import { Observable, Subject, ReplaySubject, range } from 'rxjs'
import { from, of, interval, concat } from 'rxjs'
import axios from 'axios'

test('Rx.of', () => {
    let counter = 0
    const arr = []
    const func = (x) => {
        console.log(x)
    }

    var letters = of('a', 'b', 'c')
    letters.subscribe(func)
})

const can = {
    name: 'pamplemousse',
    ounces: 12,
};

describe('Rx with Axios', () => {
    test('Rx warp fetch', () => {
        expect(typeof of(fetch('https://github.com'))).toEqual('object')
    })
    test('Rx wrap Axios', () => {
        expect(typeof of(axios.get('https://github.com'))).toEqual('object')
    })
    test('Rx wrap Axios', () => {
        var result = of(axios('http://localhost:3000/?&id=894426'));
        result.subscribe(x => console.log(x), e => console.error(e))

        //expect(typeof of(axios.get('https://github.com'))).toEqual('object')


    })
})

it('works with resolves', () => {
    expect.assertions(1);
    return expect(axios('http://localhost:3000/?&id=894426')).resolves.toEqual('Paul');
})

describe('the can', () => {
    test('has 12 ounces', () => {
        expect(can.ounces).toBe(12);
    });

    test('has a sophisticated name', () => {
        expect(can.name).toBe('pamplemousse');
    });
});