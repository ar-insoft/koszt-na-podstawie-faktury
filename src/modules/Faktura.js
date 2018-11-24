import _ from 'lodash'
import axios from 'axios'

class Faktura {
    constructor() {
        this.fields = FakturaDef
        this.id = -1
        this.forma_platnosci = '1'
        this.rok_budzetowy = (new Date()).getFullYear()
    }

    setter = (changes) => {
        Object.assign(this, changes)
        Object.keys(changes).forEach(key => this.onFieldChange(key, changes[key]))
        return this
    }

    onFieldChange = (key, value) => {
        if (key === 'wartosc_netto' || key === 'vat') {
            const wartosc_netto = isNaN(this.wartosc_netto) ? 0 : parseFloat(this.wartosc_netto)
            const vat_value = isNaN(this.vat) ? 0 : parseFloat(this.vat)
            this.wartosc_brutto = (wartosc_netto + vat_value).toFixed(2)
        }
        if (key === 'kwota_obciazajaca_budzet') {
            this.real_value = ''
            this.vat_value = ''
        }
    }

    isFieldValid = (field) => {
        //if (_has(this, 'fields[' + field + '].valid')) {
        if (typeof _.get(this, 'fields[' + field + '].valid') === 'function') {
            return _.get(this, 'fields[' + field + '].valid')(this[field])
        }
        //_.get(this, 'fields[field].valid')(this[field])
        return true
        //_.get(this, 'fields[' + field + '].valid(' + this[field] + ')', true)
    }

    isFakturaZapisana = () => {
        return this.id > 0
    }

    static readAxios(id) {
        return axios.get('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml', {
            headers: { 'Content-Type': 'application/json', responseEncoding: 'utf8',},
            params: {
                action: 'read_faktura',
                id: id
            }
        })
    }
    static save(faktura, promiseHandler) {
        const fakturaDoZapisu = { ...faktura }
        delete fakturaDoZapisu.firma
        const fakturaJson = JSON.stringify(fakturaDoZapisu)

        fetch('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_faktura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
                , responseEncoding: 'utf8'
            },
            body: 'faktura=' + fakturaJson
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                const fakturaZapisana = json
                console.log('Faktura.save fakturaZapisana', fakturaZapisana)
                Object.assign(faktura, fakturaZapisana);

                promiseHandler(faktura)
            })
    }

    static isPoprawnaDoZapisu(faktura) {
        let valid = true
        const wypelnonaWartoscKwalfikowana = !isNaN(faktura.wartosc_kwalfikowana) && faktura.wartosc_kwalfikowana > 0
        valid = valid && wypelnonaWartoscKwalfikowana
        return valid
    }

    static fakturaPozostaloDoRozliczenia(doRozliczenia, rozliczono) {
        if (isNaN(doRozliczenia) || isNaN(rozliczono)) return ''
        let pozostalo = parseFloat(doRozliczenia) - parseFloat(rozliczono)
        return pozostalo.toFixed(2)
        //const cyfrCalkowitych = Math.round(pozostalo).toString().length
        //return pozostalo.toPrecision(cyfrCalkowitych + 2)
    }
}

const FakturaDef = {
    wartosc_kwalfikowana: {
        valid: (fieldValue) => fieldValue > 0
    }
}

export { Faktura }