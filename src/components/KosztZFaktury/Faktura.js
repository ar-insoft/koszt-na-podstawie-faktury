

class Faktura {
    static save(faktura, promiseHandler) {
        const fakturaDoZapisu = { ...faktura }
        delete fakturaDoZapisu.firma
        const fakturaJson = JSON.stringify(fakturaDoZapisu)

        fetch('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_faktura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
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

    static isFakturaZapisana(faktura) {

        return faktura.id > 0
    }

    static fakturaPozostaloDoRozliczenia(doRozliczenia, rozliczono) {
        if (isNaN(doRozliczenia) || isNaN(rozliczono)) return ''
        let pozostalo = doRozliczenia - rozliczono
        return pozostalo.toFixed(2)
        //const cyfrCalkowitych = Math.round(pozostalo).toString().length
        //return pozostalo.toPrecision(cyfrCalkowitych + 2)
    }
}

export { Faktura }