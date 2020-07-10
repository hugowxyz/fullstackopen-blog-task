const dummy = require('../utils/list_helper').dummy

describe('dummy', () => {
    test('dummy test', () => {
        expect( dummy([]) ).toBe(1)
    })
})