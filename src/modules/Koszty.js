import Koszt from './Koszt'
import axios from 'axios'

class Koszty {
    constructor(initList) {
        this.listaKosztow = initList
    }

    wartoscKwalfikowanaSuma = () => {
        //console.log('Koszty.wartoscKwalfikowanaSuma', this.listaKosztow)
        let sum = parseFloat(0)
        this.listaKosztow.forEach(element => {
            //console.log('el: ' + element.kwota_obciazajaca_budzet + ' ' + isNaN(element.kwota_obciazajaca_budzet))
            sum += parseFloat(element.kwota_obciazajaca_budzet)
        });
        let suma = this.listaKosztow.reduce((a, b) => a.kwota_obciazajaca_budzet + b.kwota_obciazajaca_budzet, 0)
        //console.log('Koszty.wartoscKwalfikowanaSuma ' + suma + ' ' + isNaN(suma) + ' ' + sum + ' ' + isNaN(sum) + ' ' + (typeof sum))
        //return this.listaKosztow.reduce((a, b) => a.kwota_obciazajaca_budzet + b.kwota_obciazajaca_budzet) //.toFixed(2)
        if (isNaN(sum)) return sum
        //console.log('Koszty.wartoscKwalfikowanaSuma '+typeof(sum),sum)
        return sum.toFixed(2)
    }

    aktualizujPoleKosztu = (koszt, changes) => {
        var kosztWLiscie = this.listaKosztow.find(el => el.id === koszt.id)
        console.log('Koszty.aktualizujPoleKosztu', koszt, kosztWLiscie, changes)
        Object.assign(kosztWLiscie, changes);
        this.obserwujZmiany(kosztWLiscie, changes)
        return this
    }

    obserwujZmiany = (koszt, changes) => {
        Object.keys(changes).forEach(key => koszt.onFieldChange(key, changes[key]))
    }

    usunKoszt = (koszt, promiseHandler) => {
        const functionPominUsuniety = (el) => el.id !== koszt.id
        const akcjaPoUsunieciu = () => {
            this.listaKosztow = this.listaKosztow.filter(functionPominUsuniety)
            promiseHandler(this)
        }

        if (koszt.isSaved()) {
            koszt.delete(akcjaPoUsunieciu)
        } else {
            akcjaPoUsunieciu()
        }
    }

    moznaDodacNowyKoszt = (faktura) => {
        const pozostaloDoRozliczenia = faktura.wartosc_kwalfikowana - this.wartoscKwalfikowanaSuma()
        console.log('Koszty.moznaDodacNowyKoszt::pozostaloDoRozliczenia ' + pozostaloDoRozliczenia + ' ' + (pozostaloDoRozliczenia <= 0))
        if (pozostaloDoRozliczenia <= 0) return false
        const wszystkieKosztyZapisane = this.listaKosztow.every(koszt => koszt.isSaved)
        console.log('Koszty.moznaDodacNowyKoszt::wszystkieKosztyZapisane ' + wszystkieKosztyZapisane)
        if (!wszystkieKosztyZapisane) return false
        return true
    }
    dodajNowyKoszt = (faktura) => {
        let initialFields = {
            faktura_id: faktura.id,
            rok_budzetowy: faktura.rok_budzetowy,
            domyslnaWartosc: faktura.wartosc_kwalfikowana - this.wartoscKwalfikowanaSuma(),
        }
        const ostatniKoszt = this.listaKosztow.length > 0 ? this.listaKosztow[this.listaKosztow.length - 1] : null
        if (ostatniKoszt) {
            Object.assign(initialFields, {
                id_zlecenie: ostatniKoszt.id_zlecenie,
                projekt: ostatniKoszt.projekt,
                koszt_teta_parent_id: ostatniKoszt.koszt_teta_parent_id,
                zadanie: ostatniKoszt.zadanie,
            })
        }
        //const nowyKoszt = new Koszt(faktura.id, faktura.wartosc_kwalfikowana - this.wartoscKwalfikowanaSuma())
        const nowyKoszt = new Koszt(initialFields)
        let nowyRozmiar = this.listaKosztow.push(nowyKoszt)
        nowyKoszt.id = - nowyRozmiar
        return this
    }

    static pobierzListeKosztowAxios(idFaktury) {
        return axios.get('/eoffice/budzety_pwr/budzet_pwr_json_endpoint.xml', {
            headers: { 'Content-Type': 'application/json', responseEncoding: 'utf8', },
            params: {
                action: 'koszty_faktury',
                id: idFaktury
            },
            transformResponse: [(data) => {
                console.log('Koszty.pobierzListeKosztowAxios '+ typeof data, data)
                // Do whatever you want to transform the data
                const kosztyDb = JSON.parse(data)
                const listaKosztow = kosztyDb.map(x => Object.assign(new Koszt({}), x))
                return new Koszty(listaKosztow)
            }],
        })

        // `transformResponse` allows changes to the response data to be made before
        // it is passed to then/catch
//        transformResponse: [function (data) {
            // Do whatever you want to transform the data

//            return data;
//        }],
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
                Object.assign(kosztWLiscie, kosztZapisany);

                promiseHandler(this)
            })
    }

}

export {Koszty}