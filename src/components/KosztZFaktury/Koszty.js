class Koszty {
    constructor(initList) {
        this.listaKosztow = initList
    }

    wartoscKwalfikowanaSuma = () => {
        console.log('Koszty.wartoscKwalfikowanaSuma', this.listaKosztow)
        return this.listaKosztow.reduce((a, b) => a.kwota_obciazajaca_budzet + b.kwota_obciazajaca_budzet) //.toPrecision(6)
        //return this.roundUp(this.listaKosztow.reduce((a, b) => a.kwota_obciazajaca_budzet + b.kwota_obciazajaca_budzet), 2)
    }

    roundUp = (num, precision) => {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
    }

    aktualizujPoleKosztu = (koszt, changes) => {
        console.log('Koszty.aktualizujPoleKosztu', this, changes)
        var kosztWLiscie = this.listaKosztow.find(el => el.id === koszt.id)
        Object.assign(kosztWLiscie, changes);
        return this
    }

    dodajNowyKoszt = () => {
        const nowyKoszt = { opis: 'nowy_koszt', rok_budzetowy: 2018, kwota_obciazajaca_budzet: 0.0}
        let nowyRozmiar = this.listaKosztow.push(nowyKoszt)
        nowyKoszt.id = - nowyRozmiar
        return this
    }

    zapiszKoszt = (koszt, promiseHandler) => {
        var kosztWLiscie = this.listaKosztow.find(el => el.id === koszt.id)
        console.log('Koszty.zapiszKoszt', kosztWLiscie)
        const kosztDoZapisu = { ...kosztWLiscie }
        delete kosztDoZapisu.projekt
        delete kosztDoZapisu.zadanie
        delete kosztDoZapisu.bi
        const kosztJson = JSON.stringify(kosztDoZapisu)

        fetch('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml?action=save_koszt', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'koszt=' + kosztJson //JSON.stringify({ ...kosztWLiscie })
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                const kosztZapisany = json
                console.log('koszty.zapiszKoszt kosztZapisany', kosztZapisany)
                Object.assign(kosztWLiscie, kosztZapisany);

                promiseHandler(this)
            })
    }

}

export {Koszty}