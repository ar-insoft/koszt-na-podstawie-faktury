import { Faktura } from './Faktura'
import _ from 'lodash'

describe('nowa Faktura', () => {
    const faktura = new Faktura()
    test('jest niezapisana', () => {
        expect(faktura.isFakturaZapisana()).toBe(false)
    })
    test('ma ustawioną formę płatności', () => {
        expect(_.get(faktura, 'forma_platnosci')).toEqual('1')
    })
    test('ma ustawiony rok budżetowy', () => {
        expect(faktura.rok_budzetowy).toEqual((new Date()).getFullYear())
    })
})


test('Faktura.isFieldValid', () => {
    const faktura = new Faktura() 
    
    expect(typeof _.get(faktura, 'fields')).toEqual('object')
    expect(typeof _.get(faktura, 'fields["wartosc_kwalfikowana"].valid')).toEqual('function')
    const func = _.get(faktura, 'fields["wartosc_kwalfikowana"].valid')
    expect(func(1)).toEqual(true)
    expect(func(undefined)).toEqual(false)

    expect(faktura.isFieldValid('')).toBe(true)
    expect(faktura.isFieldValid("wartosc_kwalfikowana")).toBe(false)

    faktura.wartosc_kwalfikowana = 1.23
    expect(faktura.isFieldValid("wartosc_kwalfikowana")).toBe(true)

    //expect(utils.multiselectStringToArray(null)).toEqual([]);
    //expect(utils.multiselectStringToArray('')).toEqual([]);
    //expect(utils.multiselectStringToArray('1')).toEqual(['1']);
    //expect(utils.multiselectStringToArray('1.1,2')).toEqual(['1.1', '2']);
})