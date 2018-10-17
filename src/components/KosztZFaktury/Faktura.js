

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
}

export { Faktura }