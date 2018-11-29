import Walidator from './Walidator'

describe('Walidator.isBlank', () => {
    test('"" jest blank', () => {
        expect(Walidator.isBlank('')).toBe(true)
    })
    test('" " jest blank', () => {
        expect(Walidator.isBlank(' ')).toBe(true)
    })
    test('"abc" nie jest blank', () => {
        expect(Walidator.isBlank("abc")).toBe(false)
    })
    test('"0" nie jest blank', () => {
        expect(Walidator.isBlank("0")).toBe(false)
    })
    test('1 nie jest blank', () => {
        expect(Walidator.isBlank(1)).toBe(false)
    })
    test('0 nie jest blank', () => {
        expect(Walidator.isBlank(0)).toBe(false)
    })
    test('NaN jest blank', () => {
        expect(Walidator.isBlank(NaN)).toBe(true)
    })
})


describe('Walidator.isNotBlank', () => {
    test('"" nie jest NotBlank', () => {
        expect(Walidator.isNotBlank('')).toBe(false)
    })
    test('" " nie jest NotBlank', () => {
        expect(Walidator.isNotBlank(' ')).toBe(false)
    })
    test('"abc" jest NotBlank', () => {
        expect(Walidator.isNotBlank("abc")).toBe(true)
    })
    test('"0" jest NotBlank', () => {
        expect(Walidator.isNotBlank("0")).toBe(true)
    })
    test('1 jest NotBlank', () => {
        expect(Walidator.isNotBlank(1)).toBe(true)
    })
    test('0 jest NotBlank', () => {
        expect(Walidator.isNotBlank(0)).toBe(true)
    })
    test('NaN nie jest NotBlank', () => {
        expect(Walidator.isNotBlank(NaN)).toBe(false)
    })
})
